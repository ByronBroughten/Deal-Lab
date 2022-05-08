import { OneChildIdArrs } from "../SectionMetas/relSectionTypes/ChildTypes";
import { FeParentInfo } from "../SectionMetas/relSectionTypes/ParentTypes";
import { SectionName } from "../SectionMetas/SectionName";
import FeSection from "./FeSection";
import FeVarb from "./FeSection/FeVarb";

export type FeVarbs = { [key: string]: FeVarb };

export type FeSectionCore<SN extends SectionName> = {
  feId: string;
  parentInfo: FeParentInfo<SN>;
  sectionName: SN;
  dbId: string;
  varbs: FeVarbs;
  childFeIds: OneChildIdArrs<SN, "fe">;
};

export class HasFeSectionCore<SN extends SectionName> {
  constructor(readonly core: FeSectionCore<SN>) {}
}

export class FeSectionBasicUpdater<
  SN extends SectionName
> extends HasFeSectionCore<SN> {
  protected update(nextBaseProps: Partial<FeSectionCore<SN>>): FeSection<SN> {
    return new FeSection({ ...this.core, ...nextBaseProps });
  }
}
