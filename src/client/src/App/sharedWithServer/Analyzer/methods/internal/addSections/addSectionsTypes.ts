import { InitFeSectionCoreProps } from "../../../../FeSections/FeSection/FeSectionCore";
import { SimpleSectionName } from "../../../../SectionsMeta/baseSections";
import { FeParentInfo } from "../../../../SectionsMeta/Info";
import {
  ChildIdArrsNarrow,
  ChildIdArrsNext,
} from "../../../../SectionsMeta/relSectionTypes/ChildTypes";
import { ParentFeInfo } from "../../../../SectionsMeta/relSectionTypes/ParentTypes";
import { DbVarbs } from "../../../DbEntry";

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
