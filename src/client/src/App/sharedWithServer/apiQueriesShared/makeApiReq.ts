import Analyzer from "../Analyzer";
import { FeSectionPack } from "../Analyzer/FeSectionPack";
import { FeInfo } from "../Analyzer/SectionMetas/Info";
import { FeToDbStoreNameWithSameChildren } from "../Analyzer/SectionMetas/relNameArrs/ChildTypes";
import { FeNameInfo } from "../Analyzer/SectionMetas/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../Analyzer/SectionMetas/SectionName";
import { SectionPackRaw } from "../Analyzer/SectionPackRaw";
import {
  ApiQueryName,
  NextReq,
  StoredSectionPackInfo,
} from "../apiQueriesShared";
import {
  DbSectionPackInfoReq,
  makeReq,
  SectionPackArrReq,
  SectionPackReq,
} from "./shared";

function addIndexStoreSectionReq(
  analyzer: Analyzer,
  feInfo: FeInfo<"hasIndexStore">
): NextReq<"addSection"> {
  const { indexStoreName } = analyzer.sectionMeta(feInfo.sectionName).core;
  return makeApiReq.addSection({
    analyzer,
    feInfo,
    dbStoreName: indexStoreName as FeToDbStoreNameWithSameChildren<
      typeof feInfo.sectionName
    >,
  });
}
// const updateIndexStoreSection = addIndexStoreSectionReq;

export type AnalyzerReq = typeof makeApiReq;
export const makeApiReq = {
  nextRegister(analyzer: Analyzer): NextReq<"nextRegister"> {
    return {
      body: {
        payload: {
          registerFormData: analyzer.section("register").values({
            userName: "string",
            email: "string",
            password: "string",
          }),
          guestAccessSections: analyzer.guestAccessDbSectionPacks(),
        },
      },
    };
  },
  nextLogin(analyzer: Analyzer): NextReq<"nextLogin"> {
    return {
      body: {
        payload: analyzer.section("login").values({
          email: "string",
          password: "string",
        }),
      },
    };
  },
  get addSection() {
    return makeRawSectionPackReq;
  },
  get updateSection() {
    return makeRawSectionPackReq;
  },
  get getSection() {
    return makeDbIdSectionPackReq;
  },
  get deleteSection() {
    return makeDbIdSectionPackReq;
  },
  get replaceSectionArr() {
    return makeRawSectionPackArrReq;
  },
} as const;

type AnalyzerReqGeneral = {
  [QN in ApiQueryName]: (props: any) => NextReq<QN>;
};
type TestAnalyzerReq<T extends AnalyzerReqGeneral> = T;
type _TestAnalyzerReq = TestAnalyzerReq<AnalyzerReq>;

type MakeRawSectionPackArrReqProps<SN extends SectionName> = {
  analyzer: Analyzer;
  sectionName: SN;
  dbStoreName: FeToDbStoreNameWithSameChildren<SN>;
};
function makeRawSectionPackArrReq<SN extends SectionName>({
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
function makeRawSectionPackReq<SN extends SectionName>({
  analyzer,
  feInfo,
  dbStoreName,
}: MakeRawSectionPackReqProps<SN>): SectionPackReq {
  const rawSectionPack = analyzer.makeRawSectionPack(
    feInfo
  ) as any as SectionPackRaw<"fe", SN>;
  return makeReq({
    payload: FeSectionPack.rawFeToServer(rawSectionPack, dbStoreName),
  });
}
function makeDbIdSectionPackReq({
  dbStoreName,
  dbId,
}: StoredSectionPackInfo): DbSectionPackInfoReq {
  return makeReq({ dbStoreName, dbId });
}
