import { Req } from "../User/crudTypes";
import Analyzer from "./../Analyzer";
import { FeInfo } from "./SectionMetas/Info";
import {
  BaseName,
  DbStoreName,
  SectionFinder,
} from "./SectionMetas/relSections/baseSectionTypes";
import { SectionName } from "./SectionMetas/SectionName";

export type AnalyzerReq = typeof analyzerReq;
export const analyzerReq = {
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
  ): Req<"PutEntry"> {
    const { indexStoreName } = analyzer.section(sectionFinder);
    const dbEntry = analyzer.dbIndexEntry(sectionFinder);
    return {
      body: {
        payload: dbEntry,
        dbStoreName: indexStoreName,
      },
    };
  },
  postIndexEntry(
    analyzer: Analyzer,
    feInfo: FeInfo<"hasIndexStore">
  ): Req<"PostEntry"> {
    const { indexStoreName } = analyzer.sectionMeta(feInfo.sectionName);
    const dbEntry = analyzer.dbIndexEntry(feInfo);
    return {
      body: {
        dbStoreName: indexStoreName,
        payload: dbEntry,
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
