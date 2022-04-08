import { DbVarbs } from "../../../DbEntry";
import { OneChildIdArrs } from "../../../SectionMetas/relNameArrs/ChildTypes";
import { ParentFinder } from "../../../SectionMetas/relNameArrs/ParentTypes";
import { SectionName } from "../../../SectionMetas/SectionName";

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
