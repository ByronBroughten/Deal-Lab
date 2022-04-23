import { OneChildIdArrs } from "../../../../SectionMetas/relSectionTypes/ChildTypes";
import { ParentFinder } from "../../../../SectionMetas/relSectionTypes/ParentTypes";
import { SectionName } from "../../../../SectionMetas/SectionName";
import { DbVarbs } from "../../../DbEntry";

export type OneAddSectionProps<SN extends SectionName> = {
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
export type AddSectionProps = AllAddSectionProps[SectionName];
