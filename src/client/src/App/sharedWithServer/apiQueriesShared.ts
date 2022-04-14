import urljoin from "url-join";
import { config } from "../Constants";
import { SectionName } from "./Analyzer/SectionMetas/SectionName";
import { SectionPackRaw } from "./Analyzer/SectionPackRaw";
import { LoginCrudSchema } from "./apiQueriesShared/Login";
import { RegisterCrudSchema } from "./apiQueriesShared/Register";

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
  nextLogin: LoginCrudSchema;
  addSection: {
    req: {
      body: {
        payload: SectionPackRaw<"db", SectionName<"dbStore">>;
      };
    };
    res: {
      data: string; // dbId
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
