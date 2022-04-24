import Analyzer from "../../../sharedWithServer/Analyzer";
import { FeSectionPack } from "../../../sharedWithServer/Analyzer/FeSectionPack";
import {
  SectionPackRaw,
  ServerSectionPack,
} from "../../../sharedWithServer/Analyzer/SectionPackRaw";
import { NextReq } from "../../../sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { makeReq } from "../../../sharedWithServer/apiQueriesShared/makeGeneralReqs";
import { sectionMetas } from "../../../sharedWithServer/SectionMetas";
import { FeInfo } from "../../../sharedWithServer/SectionMetas/Info";
import { SectionName } from "../../../sharedWithServer/SectionMetas/SectionName";
import { crud } from "../../crud";
import { apiQueries } from "../apiQueriesClient";

export const sectionQueries = {
  async saveNewIndexSection(feInfo: FeInfo<"hasIndexStore">, next: Analyzer) {
    return await apiQueries.addSection(
      reqMaker.indexSectionPackReq(next, feInfo)
    );
  },
  async updateIndexSection(feInfo: FeInfo<"hasIndexStore">, next: Analyzer) {
    return await apiQueries.updateSection(
      reqMaker.indexSectionPackReq(next, feInfo)
    );
  },
  async deleteIndexEntry(
    sectionName: SectionName<"hasIndexStore">,
    dbId: string
  ) {
    const dbStoreName = sectionMetas.section(sectionName).get("indexStoreName");
    return await crud.section.delete.send({ params: { dbStoreName, dbId } });
  },
} as const;

const reqMaker = {
  indexSectionPackReq(
    analyzer: Analyzer,
    feInfo: FeInfo<"hasIndexStore">
  ): NextReq<"addSection"> {
    const { indexStoreName } = analyzer.sectionMeta(feInfo.sectionName).core;
    const feSectionPack = analyzer.makeRawSectionPack(feInfo) as SectionPackRaw<
      "fe",
      typeof feInfo.sectionName
    >;
    const sectionPack = (
      FeSectionPack.rawFeToServer as (...props: any[]) => ServerSectionPack
    )(feSectionPack, indexStoreName);
    return makeReq({ sectionPack });
  },
};
