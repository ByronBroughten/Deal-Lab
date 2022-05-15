import { GConstructor } from "../../utils/classObjects";
import {
  ApplySectionInfoGetters,
  SectionInfoGettersI,
} from "../FeSections/HasSectionInfoProps";
import { SharedSections } from "../Sections/HasSharedSections";
import { ValueTypeName } from "../SectionsMeta/relSections/rel/valueMetaTypes";
import { ChildName } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { FeSectionI } from "../SectionsState/FeSection";
import FeVarb, { ValueTypesPlusAny } from "../SectionsState/FeSection/FeVarb";
import { FeVarbsI } from "../SectionsState/FeSection/FeVarbs";
import { SectionList } from "../SectionsState/SectionList";
import { FeSections } from "../SectionsState/SectionsState";
import { HasFocalSectionProps } from "./HasFocalSectionProps";
import { SelfGetters } from "./SelfGetters";

// does it need hasFullSectionProps?
export class FocalSectionBase<SN extends SectionName> {
  readonly shared: SharedSections;
  readonly self: SelfGetters<SN>;
  constructor(props: HasFocalSectionProps<SN>) {
    this.shared = props.shared;
    this.self = new SelfGetters(props);
  }
}

export interface FullSectionBaseI<SN extends SectionName>
  extends FullSectionBaseMixins<SN> {
  childList<CN extends ChildName<SN>>(childName: CN): SectionList<CN>;
  get sections(): FeSections;
  get section(): FeSectionI<SN>;
  get varbs(): FeVarbsI<SN>;
  varb(varbName: string): FeVarb;
  value<VT extends ValueTypeName | "any">(
    varbName: string,
    valueType: VT
  ): ValueTypesPlusAny[VT];
}

function MakeFullSectionBase<
  SN extends SectionName,
  TBase extends GConstructor<FullSectionBaseMixins<SN>>
>(Base: TBase): GConstructor<FullSectionBaseI<SN>> & TBase {
  return class FullSectionGetters extends Base implements FullSectionBaseI<SN> {
    get sections(): FeSections {
      return this.shared.sections;
    }
    setSections(sections: FeSections) {
      this.shared.sections = sections;
    }
    childList<CN extends ChildName<SN>>(childName: CN): SectionList<CN> {
      return this.sections.list(childName);
    }
    get section(): FeSectionI<SN> {
      return this.sections.one(this.feInfo);
    }
    get varbs(): FeVarbsI<SN> {
      return this.section.varbs;
    }
    varb(varbName: string): FeVarb {
      return this.varbs.one(varbName);
    }
    value<VT extends ValueTypeName | "any">(
      varbName: string,
      valueType: VT
    ): ValueTypesPlusAny[VT] {
      return this.varb(varbName).value(valueType);
    }
  };
}

interface FullSectionBaseMixins<SN extends SectionName>
  extends HasFocalSectionProps<SN>,
    SectionInfoGettersI<SN> {}

const HasSectionInfoGetters = ApplySectionInfoGetters(HasFocalSectionProps);
export const FullSectionBase = MakeFullSectionBase(HasSectionInfoGetters);
