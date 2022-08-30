import { OutEntity } from "../SectionsMeta/baseSectionsUtils/baseValues/entities";
import { StateValue } from "../SectionsMeta/baseSectionsUtils/baseValues/StateValueTypes";
import { ChildIdArrsNarrow } from "../SectionsMeta/childSectionsDerived/ChildName";
import { SectionName } from "../SectionsMeta/SectionName";

export class SectionNotFoundError extends Error {}
export class TooManySectionsFoundError extends Error {}

export type StateVarb<SN extends SectionName> = {
  value: StateValue;
  outEntities: OutEntity[];
  isPureUserVarb: boolean;
};
export type StateVarbs<SN extends SectionName> = {
  [key: string]: StateVarb<SN>;
};
export type RawFeSection<SN extends SectionName> = {
  readonly sectionName: SN;
  readonly feId: string;
  readonly childFeIds: ChildIdArrsNarrow<SN>;
  readonly dbId: string;
  readonly varbs: StateVarbs<SN>;
};

export type RawFeSections = {
  readonly [SN in SectionName]: readonly RawFeSection<SN>[];
};

export type RawSectionListProps<SN extends SectionName> = {
  sectionName: SN;
  list: RawFeSection<SN>[];
};
