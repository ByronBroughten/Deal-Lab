import { z } from "zod";
import { zodSchema } from "../../utils/zod";
import {
  GeneralChildIdArrs,
  OneChildIdArrs,
  SelfOrDescendantName,
} from "../SectionMetas/relNameArrs/ChildTypes";
import { ContextName } from "../SectionMetas/relSections/baseSections";
import { zDbValue } from "../SectionMetas/relSections/baseSections/baseValues";
import { DbValue } from "../SectionMetas/relSections/rel/valueMetaTypes";
import { SectionName } from "../SectionMetas/SectionName";
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
export type OneRawSection<
  CN extends ContextName,
  SN extends SectionName = SectionName
> = GeneralRawSection & {
  dbId: string;
  dbVarbs: DbVarbs;
  childDbIds: OneChildIdArrs<SN, CN>;
};
export type RawSections<SN extends SectionName, CN extends ContextName> = {
  [DSN in SelfOrDescendantName<SN, CN>]: OneRawSection<CN, DSN>[];
};
export type RawSection<
  SN extends SectionName,
  CN extends ContextName
> = RawSections<SN, CN>[SelfOrDescendantName<SN, CN>][number];

const zDbSectionFrame: Record<keyof OneRawSection<"db">, any> = {
  dbId: zodSchema.nanoId,
  dbVarbs: z.record(zDbValue),
  childDbIds: z.record(z.array(zodSchema.string)),
};

const zDbSection = z.object(zDbSectionFrame);
export const zDbSections = z.record(z.array(zDbSection));
