import { z } from "zod";
import { zodSchema } from "../utils/zod";
import {
  GeneralRawSections,
  RawSections,
  zRawSections,
} from "./RawSectionPack/RawSection";
import { ContextName } from "./SectionMetas/relSections/baseSections";
import { SectionName } from "./SectionMetas/SectionName";

export type GeneralSectionPack = {
  sectionName: SectionName;
  contextName: ContextName;
  dbId: string;
  rawSections: GeneralRawSections;
};

export type RawSectionPack<
  CN extends ContextName,
  SN extends SectionName = SectionName
> = {
  sectionName: SN;
  dbId: string;
  contextName: CN;
  rawSections: RawSections<SN, CN>;
};

const zRawSectionPackFrame: Record<keyof RawSectionPack<"fe">, any> = {
  sectionName: zodSchema.string,
  dbId: zodSchema.nanoId,
  contextName: zodSchema.string,
  rawSections: zRawSections,
};
export const zRawSectionPack = z.object(zRawSectionPackFrame);

function _testRawSectionPack(
  feRaw: RawSectionPack<"fe", "propertyIndex">,
  dbRaw: RawSectionPack<"db", "propertyIndex">
) {
  const _test1 = feRaw.rawSections.cell;
  // @ts-expect-error
  const _test2 = feRaw.rawSections.unit;
  const _test3 = dbRaw.rawSections.unit;
}
