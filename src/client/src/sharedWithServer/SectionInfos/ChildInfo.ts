import { SectionName } from "../sectionVarbsConfig/SectionName";
import { VarbValue } from "../sectionVarbsConfig/StateValue";
import { VarbName } from "../sectionVarbsConfigDerived/baseSectionsDerived/baseSectionsVarbsTypes";
import { ChildName } from "../sectionVarbsConfigDerived/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../sectionVarbsConfigDerived/sectionChildrenDerived/ChildSectionName";

export type ChildVarbInfo<
  SN extends SectionName,
  CN extends ChildName<SN>,
  VN extends VarbName<ChildSectionName<SN, CN>> = VarbName<
    ChildSectionName<SN, CN>
  >
> = {
  childName: CN;
  varbName: VN;
};

export interface ChildValueInfo<
  SN extends SectionName,
  CN extends ChildName<SN>,
  VN extends VarbName<ChildSectionName<SN, CN>> = VarbName<
    ChildSectionName<SN, CN>
  >
> extends ChildVarbInfo<SN, CN, VN> {
  value: VarbValue<ChildSectionName<SN, CN>, VN>;
}
