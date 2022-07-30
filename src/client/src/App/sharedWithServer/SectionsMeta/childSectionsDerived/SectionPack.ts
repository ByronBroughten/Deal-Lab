import { z } from "zod";
import { zS } from "../../utils/zod";
import { SimpleSectionName, zSectionName } from "../baseSections";
import { RawSections, zRawSections } from "./SectionPack/RawSection";

export type SectionPack<SN extends SimpleSectionName = SimpleSectionName> = {
  sectionName: SN;
  dbId: string;
  rawSections: RawSections<SN>;
};

export type SectionArrPack<SN extends SimpleSectionName> = {
  sectionName: SN;
  sectionPacks: SectionPack<SN>[];
};

const zRawSectionPackFrame: Record<keyof SectionPack, any> = {
  sectionName: zSectionName,
  dbId: zS.nanoId,
  rawSections: zRawSections,
};
export const zRawSectionPack = z.object(zRawSectionPackFrame);
export const zRawSectionPackArr = z.array(zRawSectionPack);
export function isSectionPack(value: any): value is SectionPack {
  return zRawSectionPack.safeParse(value).success;
}
