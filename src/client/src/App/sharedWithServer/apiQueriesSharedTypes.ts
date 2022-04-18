import urljoin from "url-join";
import { config } from "../Constants";
import { SectionName } from "./Analyzer/SectionMetas/SectionName";
import { LoginQueryObjects } from "./apiQueriesShared/login";
import {
  DbIdRes,
  DbSectionPackInfoReq,
  DbStoreNameRes,
  SectionPackArrReq,
  SectionPackReq,
  SectionPackRes,
} from "./apiQueriesShared/makeGeneralReqs";
import { RegisterQueryObjects } from "./apiQueriesShared/register";

export const apiEndpoints = makeEndpointPaths("api");

export function makeEndpointPaths(baseEndpointBit: string) {
  const basePaths = {
    pathBit: `/${baseEndpointBit}`,
    get pathRoute() {
      return this.pathBit;
    },
    get pathFull() {
      return urljoin(config.apiEndpointBase, this.pathBit);
    },
  } as const;
  return config.apiQueryNames.reduce((endpoints, queryName) => {
    endpoints[queryName] = bitRouteAndPath(basePaths, `/${queryName}`);
    return endpoints;
  }, {} as { [QN in typeof config.apiQueryNames[number]]: BitRouteAndPath });
}
type BitRouteAndPath = { pathBit: string; pathRoute: string; pathFull: string };
function bitRouteAndPath(
  basePaths: BitRouteAndPath,
  pathBit: string
): BitRouteAndPath {
  return {
    pathBit,
    get pathRoute() {
      return urljoin(basePaths.pathRoute, this.pathBit);
    },
    get pathFull() {
      return urljoin(basePaths.pathFull, this.pathRoute);
    },
  };
}

export type ApiHttpObjects = {
  nextRegister: RegisterQueryObjects;
  nextLogin: LoginQueryObjects;
  addSection: {
    req: SectionPackReq;
    res: DbIdRes;
  };
  updateSection: {
    req: SectionPackReq;
    res: DbIdRes;
  };
  getSection: {
    req: DbSectionPackInfoReq;
    res: SectionPackRes;
  };
  deleteSection: {
    req: DbSectionPackInfoReq;
    res: DbIdRes;
  };
  replaceSectionArr: {
    req: SectionPackArrReq;
    res: DbStoreNameRes;
  };
  upgradeUserToPro: {
    req: {
      body: {
        paymentMethodId: string;
      };
    };
    res: {
      data: {
        success: boolean;
      };
    };
  };
};

export type ApiQueryName = keyof ApiHttpObjects;
export type NextReq<R extends keyof ApiHttpObjects> = ApiHttpObjects[R]["req"];
export type NextRes<R extends keyof ApiHttpObjects> = ApiHttpObjects[R]["res"];

export class QueryError extends Error {
  constructor(message: string) {
    super(message);
  }
}

type ApiHttpObjectsGeneral = {
  [QN in typeof config.apiQueryNames[number]]: {
    req: {
      body: any;
    };
    res: {
      data: any;
    };
  };
};
type ApiHttpObjectsCheck<T extends ApiHttpObjectsGeneral> = T;
type _ApiHttpObjectsTest = ApiHttpObjectsCheck<ApiHttpObjects>;

export type StoredSectionPackInfo<
  SN extends SectionName<"dbStore"> = SectionName<"dbStore">
> = {
  dbStoreName: SN;
  dbId: string;
};
