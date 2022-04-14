import urljoin from "url-join";
import { config } from "../Constants";
import { LoginQueryObjects } from "./apiQueriesShared/login";
import { RegisterCrudSchema } from "./apiQueriesShared/register";
import {
  DbIdRes,
  DbSectionInfoReq,
  SectionPackReq,
  SectionPackRes,
} from "./apiQueriesShared/shared";

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
  nextRegister: RegisterCrudSchema;
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
    req: DbSectionInfoReq;
    res: SectionPackRes;
  };
  deleteSection: {
    req: DbSectionInfoReq;
    res: DbIdRes;
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
