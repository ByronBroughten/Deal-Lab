import urljoin from "url-join";
import { config } from "../Constants";
import { makeResValidationQueryError } from "../modules/apiQueriesClient/validateRes";
import { ApiQueryName } from "./apiQueriesShared/apiQueriesSharedTypes";
import {
  isLoginHeaders,
  isLoginUserNext,
  LoginQueryObjects,
} from "./apiQueriesShared/login";
import {
  DbIdRes,
  DbPackInfoSectionReq,
  DbStoreNameRes,
  RegisterReq,
  SectionPackArrReq,
  SectionPackReq,
  SectionPackRes,
  UpgradeUserToProReq,
  UrlRes,
} from "./apiQueriesShared/makeReqAndRes";
import {
  DbStoreNameByType,
  SectionQueryName,
} from "./SectionsMeta/childSectionsDerived/DbStoreName";

export type ApiQueries = {
  addSection: AddUpdateSectionQuery;
  updateSection: AddUpdateSectionQuery;
  getSection: GetSectionQuery;
  deleteSection: DeleteSectionQuery;
  replaceSectionArr: ReplaceSectionArrQuery;
  register: (req: RegisterReq) => Promise<LoginQueryObjects["res"]>;
  login: (req: LoginQueryObjects["req"]) => Promise<LoginQueryObjects["res"]>;
  getProPaymentLink: (req: UpgradeUserToProReq) => Promise<UrlRes>;
};
type ApiQueriesTest<
  T extends Record<ApiQueryName, (req: any) => Promise<any>>
> = T;
type _Test = ApiQueriesTest<ApiQueries>;

type AddUpdateSectionQuery = <CN extends SectionQueryName>(
  req: SectionPackReq<CN>
) => Promise<DbIdRes>;

type GetSectionQuery = <CN extends SectionQueryName>(
  req: DbPackInfoSectionReq<CN>
) => Promise<SectionPackRes<CN>>;

type DeleteSectionQuery = <CN extends SectionQueryName>(
  req: DbPackInfoSectionReq<CN>
) => Promise<DbIdRes>;

type ReplaceSectionArrQuery = <CN extends DbStoreNameByType<"arrQuery">>(
  req: SectionPackArrReq<CN>
) => Promise<DbStoreNameRes<CN>>;

export type ApiQuery<QN extends ApiQueryName> = ApiQueries[QN];

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

type ApiQueriesShared = {
  [QN in ApiQueryName]: ApiQueryShared<QN>;
};
export const apiQueriesShared = makeApiQueriesShared();
function makeApiQueriesShared() {
  return config.apiQueryNames.reduce((partial, queryName) => {
    (partial[queryName] as any) = new ApiQueryShared(queryName);
    return partial;
  }, {} as ApiQueriesShared);
}

export const resValidators = {
  register: (res: any): LoginQueryObjects["res"] => {
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
