import { SectionPathContextName } from "../StateGetters/Identifiers/sectionPaths/sectionPathContexts";
import {
  ChildIdArrsNarrow,
  ChildName,
} from "../stateSchemas/fromSchema6SectionChildren/ChildName";
import { SectionName } from "../stateSchemas/schema2SectionNames";
import { StateValue } from "../stateSchemas/schema4ValueTraits/StateValue";
import { OutEntity } from "../stateSchemas/schema4ValueTraits/StateValue/stateValuesShared/entities";

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

export type ContextPathIdxSpecifier = {
  [idx: number]: {
    selfChildName: ChildName;
    feId: string;
  };
};

export type RawFeSection<SN extends SectionName> = {
  readonly contextPathIdxSpecifier: ContextPathIdxSpecifier;
  readonly sectionContextName: SectionPathContextName;
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
