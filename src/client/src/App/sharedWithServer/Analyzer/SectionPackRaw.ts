import { z } from "zod";
import { ContextName } from "../SectionMetas/baseSections";
import { SectionName } from "../SectionMetas/SectionName";
import { Obj } from "../utils/Obj";
import { StrictPick } from "../utils/types";
import { zodSchema } from "../utils/zod";
import {
  GeneralRawSections,
  RawSections,
  zRawSections,
} from "./SectionPackRaw/RawSection";

export type GeneralSectionPack = {
  sectionName: SectionName;
  contextName: ContextName;
  dbId: string;
  rawSections: GeneralRawSections;
};

export type SectionPackRaw<
  CN extends ContextName,
  SN extends SectionName = SectionName
> = {
  sectionName: SN;
  dbId: string;
  contextName: CN;
  rawSections: RawSections<SN, CN>;
};

export type StoredSectionPackInfo<
  SN extends SectionName<"dbStoreNext"> = SectionName<"dbStoreNext">
> = {
  dbStoreName: SN;
  dbId: string;
};

export type ServerSectionPack<
  SN extends SectionName<"dbStoreNext"> = SectionName<"dbStoreNext">
> = SectionPackRaw<"db", SN>;

const zRawSectionPackFrame: Record<keyof SectionPackRaw<"fe">, any> = {
  sectionName: zodSchema.string,
  dbId: zodSchema.nanoId,
  contextName: zodSchema.string,
  rawSections: zRawSections,
};
export const zRawSectionPack = z.object(zRawSectionPackFrame);
export const zRawSectionPackArr = z.array(zRawSectionPack);

export type SectionPackDbRaw<SN extends SectionName = SectionName> = StrictPick<
  SectionPackRaw<"db", SN>,
  "dbId" | "rawSections"
>;

const zSectionPackDbRawFrame = Obj.strictPick(zRawSectionPackFrame, [
  "dbId",
  "rawSections",
]);
const zSectionPackDb = z.object(zSectionPackDbRawFrame);
export const zSectionPackDbArr = z.array(zSectionPackDb);

function _testRawSectionPack(
  feRaw: SectionPackRaw<"fe", "tableRow">,
  dbRaw: SectionPackRaw<"db", "propertyIndexNext">
) {
  const _test1 = feRaw.rawSections.cell;
  // @ts-expect-error
  const _test2 = feRaw.rawSections.unit;
  const _test3 = dbRaw.rawSections.unit;
}
