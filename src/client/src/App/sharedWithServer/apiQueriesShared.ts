import urljoin from "url-join";
import { config } from "../Constants";
import { UserInfoTokenProp } from "../modules/services/authService";
import { ApiQueryName } from "./apiQueriesShared/apiQueriesSharedTypes";
import { LoginData } from "./apiQueriesShared/getUserData";
import {
  DbIdRes,
  DbPackInfoSectionReq,
  DbStoreNameRes,
  MakeReq,
  MakeRes,
  SectionPackArrReq,
  SectionPackReq,
  SectionPackRes,
  UpgradeUserToProReq,
  UrlRes,
} from "./apiQueriesShared/makeReqAndRes";
import { GuestAccessSectionPackArrs } from "./apiQueriesShared/register";
import { SubscriptionValues } from "./apiQueriesShared/SubscriptionValues";
import {
  DbStoreNameByType,
  SectionQueryName,
} from "./SectionsMeta/childSectionsDerived/DbStoreName";
import { SectionPack } from "./SectionsMeta/childSectionsDerived/SectionPack";

export type ApiQueries = {
  addSection: QueryAddSection;
  updateSection: QueryUpdateSection;
  getSection: GetSectionQuery;
  deleteSection: DeleteSectionQuery;

  replaceSectionArr: ReplaceSectionArrQuery;
  getProPaymentUrl: (req: UpgradeUserToProReq) => Promise<UrlRes>;
  getUserData: (
    req: MakeReq<{ guestAccessSections: GuestAccessSectionPackArrs }>
  ) => Promise<{
    data: LoginData;
    headers: UserInfoTokenProp;
  }>;
  getSubscriptionData: (
    req: MakeReq<{}>
  ) => Promise<{ data: SubscriptionValues; headers: UserInfoTokenProp }>;
  makeSession: (req: MakeReq<{ authId: string }>) => Promise<{ data: {} }>;
};

type GetSubscriptionDataRes = MakeRes<{
  subscriptionInfo: SectionPack<"subscriptionInfo">;
}>;

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
