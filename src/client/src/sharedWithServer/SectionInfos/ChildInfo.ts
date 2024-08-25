import { VarbName } from "../stateSchemas/derivedFromBaseSchemas/baseSectionsVarbsTypes";
import { ChildName } from "../stateSchemas/derivedFromChildrenSchemas/ChildName";
import { ChildSectionName } from "../stateSchemas/derivedFromChildrenSchemas/ChildSectionName";
import { SectionName } from "../stateSchemas/SectionName";
import { VarbValue } from "../stateSchemas/StateValue";

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
