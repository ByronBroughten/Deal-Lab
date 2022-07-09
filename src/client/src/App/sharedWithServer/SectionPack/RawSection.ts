import { z } from "zod";
import {
  ChildIdArrsWide,
  GeneralChildIdArrs,
} from "../SectionsMeta/childSectionsDerived/ChildName";
import { SelfOrDescendantSectionName } from "../SectionsMeta/childSectionsDerived/DescendantSectionName";
import { DbValue } from "../SectionsMeta/relSectionsUtils/rel/valueMetaTypes";
import { zValue } from "../SectionsMeta/relSectionsUtils/valueMeta";
import { SectionName } from "../SectionsMeta/SectionName";
import { zS } from "../utils/zod";
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
export type OneRawSection<SN extends SectionName = SectionName> = {
  dbId: string;
  dbVarbs: DbVarbs;
  childDbIds: ChildIdArrsWide<SN>;
};
export type RawSections<SN extends SectionName> = {
  [DSN in SelfOrDescendantSectionName<SN>]: OneRawSection<DSN>[];
};
export type RawSection<SN extends SectionName = SectionName> =
  RawSections<SN>[SelfOrDescendantSectionName<SN>][number];

const zRawSectionFrame: Record<keyof OneRawSection, any> = {
  dbId: zS.nanoId,
  dbVarbs: z.record(zValue),
  childDbIds: z.record(z.array(zS.string)),
};

const zRawSection = z.object(zRawSectionFrame);
export const zRawSections = z.record(z.array(zRawSection));
