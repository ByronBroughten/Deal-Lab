import { VarbName } from "../../stateSchemas/fromSchema3SectionStructures/baseSectionsVarbsTypes";
import { ChildName } from "../../stateSchemas/fromSchema6SectionChildren/ChildName";
import { ChildSectionName } from "../../stateSchemas/fromSchema6SectionChildren/ChildSectionName";
import { SectionName } from "../../stateSchemas/schema2SectionNames";
import { VarbValue } from "../../stateSchemas/schema4ValueTraits/StateValue";

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
