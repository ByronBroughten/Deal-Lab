import { SimpleSectionName } from "../../../../SectionsMeta/baseSections";
import {
  ChildIdArrsNext,
  OneChildIdArrs,
} from "../../../../SectionsMeta/relSectionTypes/ChildTypes";
import {
  ParentFeInfo,
  ParentFinder,
} from "../../../../SectionsMeta/relSectionTypes/ParentTypes";
import { SectionName } from "../../../../SectionsMeta/SectionName";
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
  parentInfo: ParentFeInfo<SN>;
  feId?: string;
  childFeIds?: ChildIdArrsNext<SN>;
  dbId?: string;
  dbVarbs?: DbVarbs;
  idx?: number;
};
