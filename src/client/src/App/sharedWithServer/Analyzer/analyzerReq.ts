import Analyzer from "../Analyzer";
import { Req } from "../Crud";
import { SectionName } from "./SectionMetas/SectionName";

export type MakeApiReq = typeof analyzerReq;
export const analyzerReq = {
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
