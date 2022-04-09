import { z } from "zod";
import { RawSectionPack } from "../client/src/App/sharedWithServer/Analyzer/RawSectionPack";
import { zRawSections } from "../client/src/App/sharedWithServer/Analyzer/RawSectionPack/RawSection";
import { SectionName } from "../client/src/App/sharedWithServer/Analyzer/SectionMetas/SectionName";
import { StrictPick } from "../client/src/App/sharedWithServer/utils/types";
import { zodSchema } from "../client/src/App/sharedWithServer/utils/zod";

export type DbUserNext = {
  [SN in SectionName<"dbStore">]: SectionPackDb<SN>[];
};

export type SectionPackDb<SN extends SectionName = SectionName> = StrictPick<
  RawSectionPack<"db", SN>,
  "dbId" | "rawSections"
>;

const zDbSectionPackFrame: Record<keyof SectionPackDb, any> = {
  dbId: zodSchema.nanoId,
  rawSections: zRawSections,
};
export const zDbSectionPack = z.object(zDbSectionPackFrame);
