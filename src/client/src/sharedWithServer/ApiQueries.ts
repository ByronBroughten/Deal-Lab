import { UserInfoTokenProp } from "../App/modules/services/userTokenS";
import { EstimatorPlanValues } from "./apiQueriesShared/EstimatorPlanValues";
import {
  DbIdRes,
  DbPackInfoSectionReq,
  MakeReq,
  MakeRes,
  SectionPackArrsReq,
  SectionPackReq,
  SectionPackRes,
  SuccessRes,
  SyncChangesReq,
  UpgradeUserToProReq,
  UrlRes,
} from "./apiQueriesShared/makeReqAndRes";
import { UserData } from "./apiQueriesShared/UserData";
import { ApiQueryName } from "./Constants/queryPaths";
import { SectionPack } from "./SectionPacks/SectionPack";
import { SectionQueryName } from "./stateSchemas/derivedFromChildrenSchemas/DbStoreName";

export type QueryRes<AN extends ApiQueryName> = Awaited<
  ReturnType<ApiQuery<AN>>
>;
export type QueryReq<AN extends ApiQueryName> = Parameters<
  ApiQuery<AN>
>[number];

export type ApiQuery<QN extends ApiQueryName> = ApiQueries[QN];
export type ApiQueries = {
  addSection: AddSection;
  updateSection: UpdateSection;
  updateSections: UpdateSections;
  getSection: GetSection;
  deleteSection: DeleteSection;

  replaceSectionArrs: ReplaceSectionArrs;
  getProPaymentUrl: (req: UpgradeUserToProReq) => Promise<UrlRes>;
  getCustomerPortalUrl: (req: MakeReq<{}>) => Promise<UrlRes>;
  getUserData: (req: MakeReq<{}>) => Promise<{
    data: UserData;
    headers: UserInfoTokenProp;
  }>;
  getSubscriptionData: (
    req: MakeReq<{}>
  ) => Promise<{ data: EstimatorPlanValues; headers: UserInfoTokenProp }>;
  makeSession: (req: MakeReq<{ authId: string }>) => Promise<{ data: {} }>;
  getArchivedDeals: (
    req: MakeReq<{}>
  ) => Promise<MakeRes<SectionPack<"deal">[]>>;
  getNewDeal: (
    req: MakeReq<LoadFromServer>
  ) => Promise<MakeRes<SectionPack<"deal">>>;
};

type ApiQueriesTest<
  T extends Record<ApiQueryName, (req: any) => Promise<any>>
> = T;
type _Test = ApiQueriesTest<ApiQueries>;

export type CreateDealReq = MakeReq<LoadFromServer>;

type LoadFromServer =
  | { loadFrom: "zillow" }
  | { loadFrom: "dataBase"; dbId: string };

type AddSection = <CN extends SectionQueryName>(
  req: SectionPackReq<CN>
) => Promise<AddSectionRes>;

interface AddSectionRes extends DbIdRes {
  headers: UserInfoTokenProp;
}

type UpdateSection = <CN extends SectionQueryName>(
  req: SectionPackReq<CN>
) => Promise<DbIdRes>;

type UpdateSections = (req: SyncChangesReq) => Promise<SuccessRes>;

type GetSection = <CN extends SectionQueryName>(
  req: DbPackInfoSectionReq<CN>
) => Promise<SectionPackRes<CN>>;

type DeleteSection = <CN extends SectionQueryName>(
  req: DbPackInfoSectionReq<CN>
) => Promise<DbIdRes>;

type ReplaceSectionArrs = (req: SectionPackArrsReq) => Promise<MakeRes<{}>>;
