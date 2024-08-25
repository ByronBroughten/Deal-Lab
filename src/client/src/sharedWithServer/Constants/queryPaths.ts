import urljoin from "url-join";
import { Obj } from "../utils/Obj";
import { envConstant } from "./envConstants";

export const apiQueryNames = [
  "getArchivedDeals",
  "addSection",
  "updateSection",
  "updateSections",
  "getSection",
  "deleteSection",
  "replaceSectionArrs",
  "getProPaymentUrl",
  "getCustomerPortalUrl",
  "getUserData",
  "getSubscriptionData",
  "makeSession",
  "getNewDeal",
] as const;

export const apiPathBit = "/api";
export const apiPathFull = `${envConstant("apiUrlBase")}${apiPathBit}`;

export type ApiQueryName = (typeof apiQueryNames)[number];

const pathObj = {
  pathBits: "bit",
  pathRoutes: "route",
  pathFull: "full",
} as const;
type PathObj = typeof pathObj;

type PathType = keyof PathObj;
const pathTypes = Obj.keys(pathObj);

type QueryPaths = {
  [P in PathType]: {
    [N in ApiQueryName]: ApiPaths[N][PathObj[P]];
  };
};
export function makeQueryPaths(): QueryPaths {
  const apiPaths = makeApiPaths();
  return pathTypes.reduce((partial, pathType) => {
    partial[pathType] = apiQueryNames.reduce((partial, queryName) => {
      partial[queryName] = apiPaths[queryName][pathObj[pathType]];
      return partial;
    }, {} as Record<ApiQueryName, string>);
    return partial;
  }, {} as QueryPaths);
}

type ApiPaths = { [QN in ApiQueryName]: BitRouteAndPath };
function makeApiPaths() {
  return apiQueryNames.reduce((endpoints, queryName) => {
    endpoints[queryName] = bitRouteAndPath(`/${queryName}`);
    return endpoints;
  }, {} as ApiPaths);
}

type BitRouteAndPath = { bit: string; route: string; full: string };
function bitRouteAndPath(pathBit: string): BitRouteAndPath {
  return {
    bit: pathBit,
    get route() {
      return urljoin(apiPathBit, this.bit);
    },
    get full() {
      return urljoin(apiPathFull, this.bit);
    },
  };
}
