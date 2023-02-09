import { VarbName } from "../baseSectionsDerived/baseSectionsVarbsTypes";
import { ChildName } from "../sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../sectionChildrenDerived/ChildSectionName";
import { SectionName } from "../SectionName";
import { VarbValue } from "../values/StateValue";

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
