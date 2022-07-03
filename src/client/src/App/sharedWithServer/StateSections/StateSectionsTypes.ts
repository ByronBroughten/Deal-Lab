import { OutEntity } from "../SectionsMeta/baseSectionsUtils/baseValues/entities";
import { StateValue } from "../SectionsMeta/baseSectionsUtils/baseValues/StateValueTypes";
import { ChildIdArrsNarrow } from "../SectionsMeta/childSectionsDerived/ChildName";
import { SectionName } from "../SectionsMeta/SectionName";

export class SectionNotFoundError extends Error {}

export type RawFeVarb<SN extends SectionName> = {
  value: StateValue;
  outEntities: OutEntity[];
  manualUpdateEditorToggle: boolean | undefined;
  // used to ensure rerenders upon loading varbs
};
export type RawFeVarbs<SN extends SectionName> = {
  [key: string]: RawFeVarb<SN>;
};
export type RawFeSection<SN extends SectionName> = {
  readonly sectionName: SN;
  readonly feId: string;
  readonly childFeIds: ChildIdArrsNarrow<SN>;
  readonly dbId: string;
  readonly varbs: RawFeVarbs<SN>;
};

export type RawFeSections = {
  readonly [SN in SectionName]: readonly RawFeSection<SN>[];
};

export type RawSectionListProps<SN extends SectionName> = {
  sectionName: SN;
  list: RawFeSection<SN>[];
};
