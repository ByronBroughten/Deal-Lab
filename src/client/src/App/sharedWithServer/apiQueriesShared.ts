import urljoin from "url-join";
import { config } from "../Constants";
import { UserInfoTokenProp } from "../modules/services/userTokenS";
import { AnalyzerPlanValues } from "./apiQueriesShared/AnalyzerPlanValues";
import { ApiQueryName } from "./apiQueriesShared/apiQueriesSharedTypes";
import {
  DbIdRes,
  DbPackInfoSectionReq,
  MakeReq,
  MakeRes,
  ReplacePackArrsReq,
  SectionPackReq,
  SectionPackRes,
  UpgradeUserToProReq,
  UrlRes,
} from "./apiQueriesShared/makeReqAndRes";
import { UserData } from "./apiQueriesShared/validateUserData";
import { SectionQueryName } from "./SectionsMeta/sectionChildrenDerived/DbStoreName";

export type ApiQueries = {
  addSection: QueryAddSection;
  updateSection: QueryUpdateSection;
  getSection: GetSectionQuery;
  deleteSection: DeleteSectionQuery;

  replaceSectionArrs: ReplaceSectionArrQuery;
  getProPaymentUrl: (req: UpgradeUserToProReq) => Promise<UrlRes>;
  getCustomerPortalUrl: (req: { body: {} }) => Promise<UrlRes>;
  getUserData: (req: MakeReq<{}>) => Promise<{
    data: UserData;
    headers: UserInfoTokenProp;
  }>;
  getSubscriptionData: (
    req: MakeReq<{}>
  ) => Promise<{ data: AnalyzerPlanValues; headers: UserInfoTokenProp }>;
  makeSession: (req: MakeReq<{ authId: string }>) => Promise<{ data: {} }>;
};

type ApiQueriesTest<
  T extends Record<ApiQueryName, (req: any) => Promise<any>>
> = T;
type _Test = ApiQueriesTest<ApiQueries>;

type QueryAddSection = <CN extends SectionQueryName>(
  req: SectionPackReq<CN>
) => Promise<AddSectionRes>;

type QueryUpdateSection = <CN extends SectionQueryName>(
  req: SectionPackReq<CN>
) => Promise<DbIdRes>;

export interface AddSectionRes extends DbIdRes {
  headers: UserInfoTokenProp;
}

type GetSectionQuery = <CN extends SectionQueryName>(
  req: DbPackInfoSectionReq<CN>
) => Promise<SectionPackRes<CN>>;

type DeleteSectionQuery = <CN extends SectionQueryName>(
  req: DbPackInfoSectionReq<CN>
) => Promise<DbIdRes>;

type ReplaceSectionArrQuery = (req: ReplacePackArrsReq) => Promise<MakeRes<{}>>;

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
