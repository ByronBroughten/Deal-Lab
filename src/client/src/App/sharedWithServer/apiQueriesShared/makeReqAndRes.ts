import { DbPack, SectionPack } from "../SectionPack/SectionPack";
import {
  DbSectionName,
  DbStoreInfo,
  DbStoreName,
  DbStoreNameProp,
} from "../SectionsMeta/childSectionsDerived/dbStoreNames";
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

export type DbPackInfoReq<CN extends DbStoreName = DbStoreName> = MakeReq<
  DbStoreInfo<CN>
>;
export type SectionPackReq<CN extends DbStoreName = DbStoreName> = MakeReq<
  DbPack<CN>
>;
export type SectionPackArrReq<CN extends DbStoreName = DbStoreName> = MakeReq<{
  dbStoreName: CN;
  sectionPackArr: SectionPack<DbSectionName<CN>>[];
}>;
export type RegisterReq = MakeReq<RegisterReqBody>;
export type UpgradeUserToProReq = MakeReq<{ priceId: string }>;
type PaymentMethodIdReq = MakeReq<{
  paymentMethodId: string;
}>;

export type UrlRes = MakeRes<{ sessionUrl: string }>;
export type SuccessRes = MakeRes<{
  success: boolean;
}>;
export type SectionPackRes<CN extends DbStoreName = DbStoreName> = MakeRes<{
  sectionPack: SectionPack<DbSectionName<CN>>;
}>;
export type DbIdRes = MakeRes<{ dbId: string }>;
export type DbStoreNameRes<CN extends DbStoreName = DbStoreName> = MakeRes<
  DbStoreNameProp<CN>
>;
