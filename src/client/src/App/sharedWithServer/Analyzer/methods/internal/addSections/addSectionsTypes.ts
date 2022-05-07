import { SimpleSectionName } from "../../../../SectionMetas/baseSections";
import {
  ChildIdArrsNext,
  OneChildIdArrs,
} from "../../../../SectionMetas/relSectionTypes/ChildTypes";
import {
  FeParentInfo,
  ParentFinder,
} from "../../../../SectionMetas/relSectionTypes/ParentTypes";
import { SectionName } from "../../../../SectionMetas/SectionName";
import { DbVarbs } from "../../../DbEntry";

export type OneAddSectionProps<SN extends SimpleSectionName> = {
  sectionName: SN;
  parentFinder: ParentFinder<SN>;
  feId?: string;
  childFeIds?: OneChildIdArrs<SN, "fe">;
  dbId?: string;
  dbVarbs?: DbVarbs;
  idx?: number;
};
type AllAddSectionProps = {
  [SN in SectionName]: OneAddSectionProps<SN>;
};
export type AddSectionProps<SN extends SimpleSectionName = SimpleSectionName> =
  AllAddSectionProps[SN];

export type AddSectionPropsNext<
  SN extends SimpleSectionName = SimpleSectionName
> = {
  sectionName: SN;
  parentInfo: FeParentInfo<SN>;
  feId?: string;
  childFeIds?: ChildIdArrsNext<SN>;
  dbId?: string;
  dbVarbs?: DbVarbs;
  idx?: number;
};

// I want it to say parentInfo
// not parentFinder
