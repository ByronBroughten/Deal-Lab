import { DbStoreName } from "../Analyzer/SectionMetas/SectionName";
import { ServerSectionPack } from "../Analyzer/SectionPackRaw";

type QueryObj = { [key: string]: any };

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

export type DbSectionPackInfo = {
  dbStoreName: DbStoreName;
  dbId: string;
};
export type SectionPackReq = MakeReq<{ payload: ServerSectionPack }>;
export type SectionPackArrReq = MakeReq<{
  sectionPackArr: ServerSectionPack[];
  dbStoreName: DbStoreName;
}>;

export type DbSectionPackInfoReq = MakeReq<DbSectionPackInfo>;
export type SectionPackRes = MakeRes<{
  rawServerSectionPack: ServerSectionPack;
}>;
export type DbIdRes = MakeRes<{ dbId: string }>;
export type DbStoreNameRes = MakeRes<{ dbStoreName: DbStoreName }>;
