import { InitFeSectionCoreProps } from "../../../../../../App/sharedWithServer/FeSections/FeSection/FeSectionCore";
import { SimpleSectionName } from "../../../../../../App/sharedWithServer/SectionsMeta/baseSections";
import { FeParentInfo } from "../../../../../../App/sharedWithServer/SectionsMeta/Info";
import {
  ChildIdArrsNarrow,
  ChildIdArrsNext,
} from "../../../../../../App/sharedWithServer/SectionsMeta/relSectionTypes/ChildTypes";
import { ParentFeInfo } from "../../../../../../App/sharedWithServer/SectionsMeta/relSectionTypes/ParentTypes";
import { DbVarbs } from "../../../../../types/DbEntry";

export type AddSectionProps<SN extends SimpleSectionName = SimpleSectionName> =
  {
    sectionName: SN;
    parentInfo: ParentFeInfo<SN>;
    feId?: string;
    childFeIds?: ChildIdArrsNext<SN>;
    dbId?: string;
    dbVarbs?: DbVarbs;
    idx?: number;
  };

export interface AddSectionPropsNext<
  SN extends SimpleSectionName = SimpleSectionName
> extends InitFeSectionCoreProps<SN> {
  sectionName: SN;
  parentInfo: FeParentInfo<SN>;
  feId?: string;
  childFeIds?: ChildIdArrsNarrow<SN>;
  dbId?: string;
  dbVarbs?: DbVarbs;
  idx?: number;
}
