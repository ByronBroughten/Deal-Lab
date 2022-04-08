import {
  GeneralChildIdArrs,
  OneChildIdArrs,
  SelfOrDescendantName,
} from "../SectionMetas/relNameArrs/ChildTypes";
import { ContextName } from "../SectionMetas/relSections/baseSections";
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
  SN extends SectionName,
  CN extends ContextName
> = GeneralRawSection & {
  dbId: string;
  dbVarbs: DbVarbs;
  childDbIds: OneChildIdArrs<SN, CN>;
};
export type RawSections<SN extends SectionName, CN extends ContextName> = {
  [DSN in SelfOrDescendantName<SN, CN>]: OneRawSection<DSN, CN>[];
};
export type RawSection<
  SN extends SectionName,
  CN extends ContextName
> = RawSections<SN, CN>[SelfOrDescendantName<SN, CN>][number];
