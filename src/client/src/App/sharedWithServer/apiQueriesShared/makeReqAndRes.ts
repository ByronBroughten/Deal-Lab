import {
  SectionPackRaw,
  ServerSectionPack,
} from "../SectionPack/SectionPackRaw";
import { SavableSectionName } from "../SectionsMeta/relNameArrs/storeArrs";
import { SectionName } from "../SectionsMeta/SectionName";

export const makeReq = <B extends QueryObj>(body: B): MakeReq<B> => ({ body });
type MakeReq<B extends QueryObj> = {
  body: B;
};
export const makeRes = <Data extends QueryObj>(data: Data): MakeRes<Data> => ({
  data,
});
export type MakeRes<Data extends QueryObj> = {
  data: Data;
};
type QueryObj = { [key: string]: any };

export type DbSectionPackInfo = {
  dbStoreName: SavableSectionName;
  dbId: string;
};
export type DbSectionPackInfoNext = {
  dbStoreName: SavableSectionName<"indexStore">;
  dbId: string;
};

export type SectionPackReq = MakeReq<{ sectionPack: ServerSectionPack }>;
export type SectionPackArrReq<
  SN extends SectionName<"arrStore"> = SectionName<"arrStore">
> = MakeReq<{
  sectionPackArr: SectionPackRaw<SN>[];
  dbStoreName: SN;
}>;
export type TableSourcePackReq = MakeReq<{
  sourceSectionPack: ServerSectionPack;
  rowSectionPack: ServerSectionPack;
}>;

export type DbSectionPackInfoReq = MakeReq<DbSectionPackInfo>;
export type SectionPackRes = MakeRes<{
  rawServerSectionPack: ServerSectionPack;
}>;
export type DbIdRes = MakeRes<{ dbId: string }>;
export type DbStoreNameRes = MakeRes<{ dbStoreName: SavableSectionName }>;
