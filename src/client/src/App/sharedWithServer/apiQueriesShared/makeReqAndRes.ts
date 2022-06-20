import {
  SectionPackRaw,
  ServerSectionPack,
} from "../SectionPack/SectionPackRaw";
import { DbSectionName } from "../SectionsMeta/relNameArrs/storeArrs";
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
  sectionName: DbSectionName;
  dbId: string;
};
export type DbSectionPackInfoNext = {
  sectionName: DbSectionName<"indexStore">;
  dbId: string;
};

export type SectionPackReq = MakeReq<{ sectionPack: ServerSectionPack }>;
export type SectionPackArrReq<
  SN extends SectionName<"arrStore"> = SectionName<"arrStore">
> = MakeReq<{
  sectionPackArr: SectionPackRaw<SN>[];
  sectionName: SN;
}>;
export type TableSourcePackReq = MakeReq<{
  sourceSectionPack: ServerSectionPack;
  rowSectionPack: ServerSectionPack;
}>;

export type DbSectionPackInfoReq = MakeReq<DbSectionPackInfo>;
export type SectionPackRes = MakeRes<{
  sectionPack: ServerSectionPack;
}>;
export type DbIdRes = MakeRes<{ dbId: string }>;
export type DbStoreNameRes = MakeRes<{ sectionName: DbSectionName }>;
