import urljoin from "url-join";
import { config } from "../Constants";
import { makeResValidationQueryError } from "../modules/useQueryActionsTest/apiQueriesClient/validateRes";
import {
  ApiQueryName,
  NextReq,
  NextRes,
} from "./apiQueriesShared/apiQueriesSharedTypes";
import { isLoginHeaders, isLoginUserNext } from "./apiQueriesShared/login";

export type ApiQueries = {
  [QN in ApiQueryName]: ApiQuery<QN>;
};
export type ApiQuery<QN extends ApiQueryName> = (
  reqObj: NextReq<QN>
) => Promise<NextRes<QN>>;

const apiPaths = makeApiPaths();

class ApiQueryShared<QN extends ApiQueryName> {
  constructor(readonly queryName: QN) {}
  get pathBit() {
    return this.path.bit;
  }
  get pathRoute() {
    return this.path.route;
  }
  get pathFull() {
    return this.path.full;
  }
  private get path() {
    return apiPaths[this.queryName];
  }
}

export const apiQueriesShared = makeApiQueriesShared();

function makeApiQueriesShared() {
  return config.apiQueryNames.reduce((partial, queryName) => {
    (partial[queryName] as any) = new ApiQueryShared(queryName);
    return partial;
  }, {} as ApiQueriesShared);
}

type ApiQueriesShared = {
  [QN in ApiQueryName]: ApiQueryShared<QN>;
};

export const resValidators = {
  register: (res: any): NextRes<"register"> => {
    if (res && isLoginUserNext(res.data) && isLoginHeaders(res.headers)) {
      return {
        data: res.data,
        headers: res.headers,
      };
    } else throw makeResValidationQueryError();
  },
};

function makeApiPaths() {
  return config.apiQueryNames.reduce((endpoints, queryName) => {
    endpoints[queryName] = bitRouteAndPath(`/${queryName}`);
    return endpoints;
  }, {} as { [QN in typeof config.apiQueryNames[number]]: BitRouteAndPath });
}
type BitRouteAndPath = { bit: string; route: string; full: string };
function bitRouteAndPath(pathBit: string): BitRouteAndPath {
  return {
    bit: pathBit,
    get route() {
      return urljoin(config.apiPathBit, this.bit);
    },
    get full() {
      return urljoin(config.apiPathFull, this.bit);
    },
  };
}
