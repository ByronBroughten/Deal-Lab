import { z } from "zod";
import { zS } from "../../../utils/zod";
import { SimpleSectionName } from "../../baseSections";
import { zValue } from "../../baseSectionsUtils/valueMeta";
import { DbValue } from "../../baseSectionsUtils/valueMetaTypes";
import { ChildIdArrsWide, GeneralChildIdArrs } from "../ChildName";
import { SelfOrDescendantSectionName } from "../DescendantSectionName";

export type DbVarbs = {
  [varbName: string]: DbValue;
};
export type GeneralRawSection = {
  dbId: string;
  dbVarbs: DbVarbs;
  childDbIds: GeneralChildIdArrs;
};
export type GeneralRawSections = {
  [key: string]: GeneralRawSection[];
};
export type OneRawSection<SN extends SimpleSectionName = SimpleSectionName> = {
  dbId: string;
  dbVarbs: DbVarbs;
  childDbIds: ChildIdArrsWide<SN>;
};
export type RawSections<SN extends SimpleSectionName> = {
  [DSN in SelfOrDescendantSectionName<SN>]: OneRawSection<DSN>[];
};
export type RawSection<SN extends SimpleSectionName = SimpleSectionName> =
  RawSections<SN>[SelfOrDescendantSectionName<SN>][number];

const zRawSectionFrame: Record<keyof OneRawSection, any> = {
  dbId: zS.nanoId,
  dbVarbs: z.record(zValue),
  childDbIds: z.record(z.array(zS.string)),
};

const zRawSection = z.object(zRawSectionFrame);
export const zRawSections = z.record(z.array(zRawSection));
