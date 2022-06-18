import { z } from "zod";
import { SectionName, SectionNameType } from "../SectionsMeta/SectionName";
import { Obj } from "../utils/Obj";
import { StrictOmit } from "../utils/types";
import { zodSchema } from "../utils/zod";
import { GeneralRawSections, RawSections, zRawSections } from "./RawSection";

export type GeneralSectionPack = {
  sectionName: SectionName;
  dbId: string;
  rawSections: GeneralRawSections;
};

export type SectionArrPack<SN extends SectionName> = {
  sectionName: SN;
  sectionPacks: SectionPackRaw<SN>[];
};

export type SectionPackArrs<ST extends SectionNameType> = {
  [SN in SectionName<ST>]: SectionPackRaw<SN>[];
};

export type SectionPackRaw<SN extends SectionName = SectionName> = {
  sectionName: SN;
  dbId: string;
  rawSections: RawSections<SN>;
};

export type StoredSectionPackInfo<
  SN extends SectionName<"dbStoreNext"> = SectionName<"dbStoreNext">
> = {
  dbStoreName: SN;
  dbId: string;
};

export type ServerSectionPack<
  SN extends SectionName<"dbStoreNext"> = SectionName<"dbStoreNext">
> = SectionPackRaw<SN>;

const zRawSectionPackFrame: Record<keyof SectionPackRaw, any> = {
  sectionName: zodSchema.string,
  dbId: zodSchema.nanoId,
  rawSections: zRawSections,
};
export const zRawSectionPack = z.object(zRawSectionPackFrame);
export const zRawSectionPackArr = z.array(zRawSectionPack);

export type SectionPackDbRaw<SN extends SectionName = SectionName> = StrictOmit<
  SectionPackRaw<SN>,
  "sectionName"
>;

const zSectionPackDbRawFrame = Obj.strictPick(zRawSectionPackFrame, [
  "dbId",
  "rawSections",
]);
const zSectionPackDb = z.object(zSectionPackDbRawFrame);
export const zSectionPackDbArr = z.array(zSectionPackDb);

function _testRawSectionPack(
  feRaw: SectionPackRaw<"tableRow">,
) {
  const _test1 = feRaw.rawSections.cell;
  // @ts-expect-error
  const _test2 = feRaw.rawSections.unit;
}
