import { SimpleSectionName } from "../baseSections";
import { ChildSectionNameNarrow } from "./ChildSectionName";

export type DescendantSectionName<SN extends SimpleSectionName> =
  ChildSectionNameNarrow<SN> extends never
    ? never
    :
        | ChildSectionNameNarrow<SN>
        | DescendantSectionName<ChildSectionNameNarrow<SN>>;

export type SelfOrDescendantSectionName<SN extends SimpleSectionName> =
  | SN
  | DescendantSectionName<SN>;

export type DescendantIds<SN extends SimpleSectionName> = {
  [S in DescendantSectionName<SN>]: string[];
};
export type SelfAndDescendantIds<SN extends SimpleSectionName> = {
  [S in SelfOrDescendantSectionName<SN>]: string[];
};

function _testDescendantType<
  SN extends SelfOrDescendantSectionName<"propertyGeneral">
>(sn: SN) {
  type FeTest = DescendantSectionName<"propertyGeneral">;
  const _test1: FeTest = "unit";
  // @ts-expect-error
  const _test3: FeTest = "loan";
}
