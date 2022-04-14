import Analyzer from "../Analyzer";
import { FeToDbStoreNameWithSameChildren } from "../Analyzer/SectionMetas/relNameArrs/ChildTypes";
import { NextReq } from "../apiQueriesShared";
import { Req } from "../Crud";
import { FeInfo } from "./SectionMetas/Info";
import { SectionFinder } from "./SectionMetas/relSections/baseSectionTypes";
import { FeNameInfo } from "./SectionMetas/relSections/rel/relVarbInfoTypes";
import { SectionName } from "./SectionMetas/SectionName";
import { SectionPack } from "./SectionPack";
import { SectionPackRaw } from "./SectionPackRaw";

function getAddSectionReq<SN extends SectionName>(
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

export type AnalyzerReq = typeof analyzerReq;
export const analyzerReq = {
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
  addIndexStoreSection(
    analyzer: Analyzer,
    feInfo: FeInfo<"hasIndexStore">
  ): NextReq<"addSection"> {
    const { indexStoreName } = analyzer.sectionMeta(feInfo.sectionName).core;
    return getAddSectionReq(
      analyzer,
      feInfo,
      indexStoreName as FeToDbStoreNameWithSameChildren<
        typeof feInfo.sectionName
      >
    );
  },
  postIndexEntry(
    analyzer: Analyzer,
    feInfo: FeInfo<"hasIndexStore">
  ): Req<"PostEntry"> {
    const { indexStoreName } = analyzer.sectionMeta(feInfo.sectionName).core;
    const dbEntry = analyzer.dbIndexEntry(feInfo);
    return {
      body: {
        dbStoreName: indexStoreName,
        payload: dbEntry,
      },
    };
  },
  register(analyzer: Analyzer): Req<"Register"> {
    return {
      body: {
        payload: {
          registerFormData: analyzer.section("register").values({
            userName: "string",
            email: "string",
            password: "string",
          }),
          guestAccessSections: analyzer.dbEntryArrs("feGuestAccessStore"),
        },
      },
    };
  },
  login(analyzer: Analyzer): Req<"Login"> {
    return {
      body: {
        payload: analyzer.section("login").values({
          email: "string",
          password: "string",
        }),
      },
    };
  },
  putSection(
    analyzer: Analyzer,
    sectionFinder: SectionFinder<SectionName<"hasIndexStore">>
  ): Req<"PutSection"> {
    const { indexStoreName } = analyzer.section(sectionFinder);
    const dbEntry = analyzer.dbIndexEntry(sectionFinder);
    return {
      body: {
        payload: dbEntry,
        dbStoreName: indexStoreName,
      },
    };
  },
  getSection(
    _: Analyzer,
    dbStoreName: SectionName<"dbStore">,
    dbId: string
  ): Req<"GetSection"> {
    return {
      params: {
        dbStoreName,
        dbId,
      },
    };
  },
  deleteSection(
    _: Analyzer,
    dbStoreName: SectionName<"dbStore">,
    dbId: string
  ): Req<"DeleteSection"> {
    return {
      params: {
        dbStoreName,
        dbId,
      },
    };
  },
  postSectionArr(
    analyzer: Analyzer,
    sectionName: SectionName<"savable">
  ): Req<"PostSectionArr"> {
    const dbEntryArr = analyzer.dbEntryArr(sectionName);
    return {
      body: {
        payload: dbEntryArr,
        dbStoreName: sectionName,
      },
    };
  },
} as const;
