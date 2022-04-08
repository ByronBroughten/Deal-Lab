import { z } from "zod";
import { zodSchema } from "../utils/zod";
import { RawSectionPack } from "./RawSectionPack";
import { zDbSections } from "./RawSectionPack/RawSection";
import { SectionContextProps, SectionName } from "./SectionMetas/SectionName";

export type SectionPackDb<SN extends SectionName = SectionName> = Omit<
  RawSectionPack<"db", SN>,
  keyof SectionContextProps<SN, "db">
>;

const zDbSectionPackFrame: Record<keyof SectionPackDb, any> = {
  dbId: zodSchema.nanoId,
  rawSections: zDbSections,
};
export const zDbSectionPack = z.object(zDbSectionPackFrame);
