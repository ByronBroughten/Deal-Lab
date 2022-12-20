import { VarbName } from "../baseSectionsDerived/baseSectionsVarbsTypes";
import { VarbValue } from "../baseSectionsDerived/valueMetaTypes";
import { SectionName } from "../SectionName";
import { ChildName } from "./ChildName";
import { ChildSectionName } from "./ChildSectionName";

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
