import { z } from "zod";
import { zS } from "../../../utils/zod";
import { SectionName } from "../../SectionName";
import { StateValue } from "../../values/StateValue";
import { zValue } from "../../values/valueMetas";
import { ChildName } from "../ChildName";

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

export type SectionValuesGeneric = {
  [varbName: string]: StateValue;
};
export type GeneralRawSection = {
  spNum: number;
  feId: string;
  dbId: string;
  dbVarbs: SectionValuesGeneric;
  childSpNums: GeneralChildNumArrs;
};
export type GeneralRawSections = {
  [key: string]: GeneralRawSection[];
};
export type OneRawSection<SN extends SectionName = SectionName> = {
  spNum: number;
  dbId: string;
  dbVarbs: SectionValuesGeneric;
  childSpNums: ChildSpNums<SN>;
};
export type RawSections = {
  [descendantName: string]: OneRawSection[];
};
export type RawSection = RawSections[string][number];

const zRawSectionFrame: Record<keyof OneRawSection, any> = {
  spNum: zS.number,
  dbId: zS.nanoId,
  dbVarbs: z.record(zValue),
  childSpNums: z.record(z.array(zS.number)),
};

const zRawSection = z.object(zRawSectionFrame);
export const zRawSections = z.record(z.array(zRawSection));
