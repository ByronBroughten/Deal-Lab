import { FeInfo } from "../../sharedWithServer/Analyzer/SectionMetas/Info";
import { FeToDbStoreNameWithSameChildren } from "../../sharedWithServer/Analyzer/SectionMetas/relNameArrs/ChildTypes";
import { FeNameInfo } from "../../sharedWithServer/Analyzer/SectionMetas/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../../sharedWithServer/Analyzer/SectionMetas/SectionName";
import { SectionPack } from "../../sharedWithServer/Analyzer/SectionPack";
import { SectionPackRaw } from "../../sharedWithServer/Analyzer/SectionPackRaw";
import {
  NextReq,
  StoredSectionPackInfo,
} from "../../sharedWithServer/apiQueriesShared";
import Analyzer from "./../../sharedWithServer/Analyzer";

function addIndexStoreSectionReq(
  analyzer: Analyzer,
  feInfo: FeInfo<"hasIndexStore">
): NextReq<"addSection"> {
  const { indexStoreName } = analyzer.sectionMeta(feInfo.sectionName).core;
  return apiReqs.addSection(
    analyzer,
    feInfo,
    indexStoreName as FeToDbStoreNameWithSameChildren<typeof feInfo.sectionName>
  );
}

const updateIndexStoreSection = addIndexStoreSectionReq;

export type AnalyzerReq = typeof apiReqs;
export const apiReqs = {
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
  // postSectionArr(
  //   analyzer: Analyzer,
  //   sectionName: SectionName<"savable">
  // ): Req<"PostSectionArr"> {
  //   const dbEntryArr = analyzer.dbEntryArr(sectionName);
  //   return {
  //     body: {
  //       payload: dbEntryArr,
  //       dbStoreName: sectionName,
  //     },
  //   };
  // },
} as const;

function makeRawSectionPackReq<SN extends SectionName>(
  analyzer: Analyzer,
  feInfo: FeNameInfo<SN>,
  sectionName: FeToDbStoreNameWithSameChildren<SN>
): NextReq<"addSection"> {
  const rawSectionPack = analyzer.makeRawSectionPack(
    feInfo
  ) as any as SectionPackRaw<"fe", SN>;
  const sectionPack = new SectionPack(rawSectionPack);
  return {
    body: {
      payload: sectionPack.feToServerRaw(
        sectionName
      ) as any as NextReq<"addSection">["body"]["payload"],
    },
  };
}
function makeDbIdSectionPackReq({
  dbStoreName,
  dbId,
}: StoredSectionPackInfo): NextReq<"getSection"> {
  return {
    body: {
      dbStoreName,
      dbId,
    },
  };
}
