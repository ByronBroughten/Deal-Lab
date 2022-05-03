import { z } from "zod";
import { zDbValue } from "../../SectionMetas/baseSections/baseValues";
import { DbValue } from "../../SectionMetas/relSections/rel/valueMetaTypes";
import {
  GeneralChildIdArrs,
  OneChildIdArrs,
  SelfOrDescendantName,
} from "../../SectionMetas/relSectionTypes/ChildTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import { zodSchema } from "../../utils/zod";
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
export type OneRawSection<SN extends SectionName = SectionName> =
  GeneralRawSection & {
    dbId: string;
    dbVarbs: DbVarbs;
    childDbIds: OneChildIdArrs<SN>;
  };
export type RawSections<SN extends SectionName> = {
  [DSN in SelfOrDescendantName<SN>]: OneRawSection<DSN>[];
};
export type RawSection<SN extends SectionName = SectionName> =
  RawSections<SN>[SelfOrDescendantName<SN>][number];

const zRawSectionFrame: Record<keyof OneRawSection, any> = {
  dbId: zodSchema.nanoId,
  dbVarbs: z.record(zDbValue),
  childDbIds: z.record(z.array(zodSchema.string)),
};

const zRawSection = z.object(zRawSectionFrame);
export const zRawSections = z.record(z.array(zRawSection));
