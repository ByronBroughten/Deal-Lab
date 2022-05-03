import Analyzer from "../Analyzer";
import { FeSectionPack } from "../Analyzer/FeSectionPack";
import {
  SectionPackRaw,
  ServerSectionPack,
  StoredSectionPackInfo,
} from "../Analyzer/SectionPackRaw";
import { SavableSectionName } from "../SectionMetas/relNameArrs/storeArrs";
import { FeNameInfo } from "../SectionMetas/relSections/rel/relVarbInfoTypes";
import { FeToDbStoreNameWithSameChildren } from "../SectionMetas/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionMetas/SectionName";

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

type MakeRawSectionPackArrReqProps<SN extends SectionName> = {
  analyzer: Analyzer;
  sectionName: SN;
  dbStoreName: FeToDbStoreNameWithSameChildren<SN, "arrStore">;
};
export function makeRawSectionPackArrReq<SN extends SectionName>({
  analyzer,
  sectionName,
  dbStoreName,
}: MakeRawSectionPackArrReqProps<SN>): SectionPackArrReq {
  const rawSectionPackArr = analyzer.makeRawSectionPackArr(
    sectionName
  ) as SectionPackRaw<"fe", SN>[];
  return makeReq({
    dbStoreName,
    sectionPackArr: rawSectionPackArr.map((rawPack) => {
      return FeSectionPack.rawFeToServer(rawPack, dbStoreName);
    }),
  });
}

type MakeRawSectionPackReqProps<SN extends SectionName> = {
  analyzer: Analyzer;
  feInfo: FeNameInfo<SN>;
  dbStoreName: FeToDbStoreNameWithSameChildren<SN>;
};
export function makeRawSectionPackReq<SN extends SectionName>({
  analyzer,
  feInfo,
  dbStoreName,
}: MakeRawSectionPackReqProps<SN>): SectionPackReq {
  const rawSectionPack = analyzer.makeRawSectionPack(
    feInfo
  ) as any as SectionPackRaw<"fe", SN>;
  return makeReq({
    sectionPack: FeSectionPack.rawFeToServer(rawSectionPack, dbStoreName),
  });
}
export function makeDbIdSectionPackReq({
  dbStoreName,
  dbId,
}: StoredSectionPackInfo): DbSectionPackInfoReq {
  return makeReq({ dbStoreName, dbId });
}

export type DbSectionPackInfo = {
  dbStoreName: SavableSectionName;
  dbId: string;
};
export type DbSectionPackInfoNext = {
  dbStoreName: SavableSectionName<"indexStore">;
  dbId: string;
};

export type SectionPackReq = MakeReq<{ sectionPack: ServerSectionPack }>;
export type SectionPackArrReq = MakeReq<{
  sectionPackArr: ServerSectionPack[];
  dbStoreName: SavableSectionName<"arrStore">;
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
