import { ChildIdArrsNarrow } from "../SectionsMeta/sectionChildrenDerived/ChildName";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { SectionPathContextName } from "../SectionsMeta/sectionPathContexts";
import { StateValue } from "../SectionsMeta/values/StateValue";
import { OutEntity } from "../SectionsMeta/values/StateValue/valuesShared/entities";

export class SectionNotFoundError extends Error {}
export class TooManySectionsFoundError extends Error {}

export type StateVarb<SN extends SectionNameByType> = {
  value: StateValue;
  outEntities: OutEntity[];
  isPureUserVarb: boolean;
};
export type StateVarbs<SN extends SectionNameByType> = {
  [key: string]: StateVarb<SN>;
};
export type RawFeSection<SN extends SectionNameByType> = {
  readonly sectionContextName: SectionPathContextName;
  readonly sectionName: SN;
  readonly feId: string;
  readonly childFeIds: ChildIdArrsNarrow<SN>;
  readonly dbId: string;
  readonly varbs: StateVarbs<SN>;
};

export type RawFeSections = {
  readonly [SN in SectionNameByType]: readonly RawFeSection<SN>[];
};

export type RawSectionListProps<SN extends SectionNameByType> = {
  sectionName: SN;
  list: RawFeSection<SN>[];
};
