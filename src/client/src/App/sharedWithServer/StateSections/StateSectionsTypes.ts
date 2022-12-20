import { OutEntity } from "../SectionsMeta/baseSectionsVarbs/baseValues/entities";
import { StateValue } from "../SectionsMeta/baseSectionsVarbs/baseValues/StateValueTypes";
import { ChildIdArrsNarrow } from "../SectionsMeta/sectionChildrenDerived/ChildName";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";

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
