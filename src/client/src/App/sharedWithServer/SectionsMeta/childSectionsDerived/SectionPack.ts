import { z } from "zod";
import { zS } from "../../utils/zod";
import { SectionName, zSectionName } from "../SectionName";
import { RawSections, zRawSections } from "./SectionPack/RawSection";

export type SectionPack<SN extends SectionName = SectionName> = {
  dbId: string;
  sectionName: SN;
  rawSections: RawSections<SN>;
};

export type SectionArrPack<SN extends SectionName> = {
  sectionName: SN;
  sectionPacks: SectionPack<SN>[];
};

const zRawSectionPackFrame: Record<keyof SectionPack, any> = {
  dbId: zS.nanoId,
  sectionName: zSectionName,
  rawSections: zRawSections,
};
export const zRawSectionPack = z.object(zRawSectionPackFrame);
export const zRawSectionPackArr = z.array(zRawSectionPack);
export function isSectionPack(value: any): value is SectionPack {
  return zRawSectionPack.safeParse(value).success;
}

export function validateSectionPack(value: any): value is SectionPack<any> {
  zRawSectionPack.parse(value);
  return true;
}
