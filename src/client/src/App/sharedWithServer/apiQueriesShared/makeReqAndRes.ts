import { DbPack } from "../SectionsMeta/childSectionsDerived/DbSectionPack";
import {
  AllQueryName,
  DbSectionName,
  DbStoreInfo,
  DbStoreNameProp,
  SectionArrQueryName,
  SectionQueryName,
} from "../SectionsMeta/childSectionsDerived/DbStoreName";
import { SectionPack } from "../SectionsMeta/childSectionsDerived/SectionPack";
import { RegisterReqBody } from "./register";

export const makeReq = <B extends QueryObj>(body: B): MakeReq<B> => ({ body });
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
export type SectionPackArrReq<
  CN extends SectionArrQueryName = SectionArrQueryName
> = MakeReq<{
  dbStoreName: CN;
  sectionPackArr: SectionPack<DbSectionName<CN>>[];
}>;
export type RegisterReq = MakeReq<RegisterReqBody>;
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
export type DbStoreNameRes<CN extends AllQueryName = AllQueryName> = MakeRes<
  DbStoreNameProp<CN>
>;
