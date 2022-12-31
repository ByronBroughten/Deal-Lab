import { z } from "zod";
import { zS } from "../../../utils/zod";
import { zValue } from "../../baseSectionsDerived/valueMetas";
import { DbValue } from "../../baseSectionsDerived/valueMetaTypes";
import { SectionName } from "../../SectionName";
import { ChildName } from "../ChildName";
import { SelfOrDescendantSectionName } from "../DescendantSectionName";

type GeneralChildNumArrs = Record<string, number[]>;
export type ChildSpNums<SN extends SectionName> = {
  [CHN in ChildName<SN>]: number[];
};

export type SpChildInfo<
  SN extends SectionName,
  CN extends ChildName<SN> = ChildName<SN>
> = {
  childName: CN;
  spNum: number;
};

export type DbVarbs = {
  [varbName: string]: DbValue;
};
export type GeneralRawSection = {
  spNum: number;
  feId: string;
  dbId: string;
  dbVarbs: DbVarbs;
  childSpNums: GeneralChildNumArrs;
};
export type GeneralRawSections = {
  [key: string]: GeneralRawSection[];
};
export type OneRawSection<SN extends SectionName = SectionName> = {
  spNum: number;
  dbId: string;
  dbVarbs: DbVarbs;
  childSpNums: ChildSpNums<SN>;
};
export type RawSections<SN extends SectionName> = {
  [DSN in SelfOrDescendantSectionName<SN>]: OneRawSection<DSN>[];
};
export type RawSection<SN extends SectionName = SectionName> =
  RawSections<SN>[SelfOrDescendantSectionName<SN>][number];

const zRawSectionFrame: Record<keyof OneRawSection, any> = {
  spNum: zS.number,
  dbId: zS.nanoId,
  dbVarbs: z.record(zValue),
  childSpNums: z.record(z.array(zS.number)),
};

const zRawSection = z.object(zRawSectionFrame);
export const zRawSections = z.record(z.array(zRawSection));
