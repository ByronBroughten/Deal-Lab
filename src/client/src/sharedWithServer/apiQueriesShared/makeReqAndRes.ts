import {
  DbSectionName,
  DbStoreInfo,
  DbStoreNameByType,
  DbStoreNameProp,
  SectionQueryName,
} from "../stateSchemas/derivedFromChildrenSchemas/DbStoreName";
import { ChildPackArrs } from "../StateTransports/ChildSectionPack";
import { DbPack } from "../StateTransports/DbSectionPack";
import { SectionPack } from "../StateTransports/SectionPack";
import { DbAction } from "./DbAction";

export const makeReq = <B extends QueryObj = {}>(body?: B): MakeReq<B> => ({
  body: body ?? ({} as B),
});
export type MakeReq<B extends QueryObj> = {
  body: B;
};
export const makeRes = <Data extends QueryObj>(data: Data): MakeRes<Data> => ({
  data,
});
export type MakeRes<Data extends QueryObj> = {
  data: Data;
};
type QueryObj = { [key: string]: any };

export type DbPackInfoSectionReq<
  CN extends SectionQueryName = SectionQueryName
> = MakeReq<DbStoreInfo<CN>>;
export type SectionPackReq<CN extends SectionQueryName = SectionQueryName> =
  MakeReq<DbPack<CN>>;
export type SectionPackArrsReq = MakeReq<{
  sectionPackArrs: DbPackArrQueryArrs;
}>;
export type SyncChangesReq = MakeReq<{
  changes: DbAction[];
}>;

export type DbPackArrQueryArrs = Partial<
  ChildPackArrs<"dbStore", DbStoreNameByType<"sectionQuery">>
>;

export type UpgradeUserToProReq = MakeReq<{ priceId: string }>;

export type UrlRes = MakeRes<{ sessionUrl: string }>;
export type SuccessRes = MakeRes<{
  success: boolean;
}>;
export type SectionPackRes<CN extends SectionQueryName = SectionQueryName> =
  MakeRes<{
    sectionPack: SectionPack<DbSectionName<CN>>;
  }>;

export type DbIdRes = MakeRes<{ dbId: string }>;
export type DbStoreNameRes<CN extends SectionQueryName = SectionQueryName> =
  MakeRes<DbStoreNameProp<CN>>;
