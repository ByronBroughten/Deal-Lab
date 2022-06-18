import {
  SpecificSectionInfo,
  SpecificVarbInfo,
} from "../../../../../App/sharedWithServer/SectionsMeta/relSections/rel/relVarbInfoTypes";
import Analyzer from "../../../Analyzer";
import {
  StateValueAnyKey,
  ValueTypesPlusAny,
} from "../../StateSection/StateVarb";

export function value<T extends StateValueAnyKey = "any">(
  this: Analyzer,
  feVarbInfo: SpecificVarbInfo,
  valueType?: T
): ValueTypesPlusAny[T];
export function value(
  this: Analyzer,
  feVarbInfo: SpecificVarbInfo,
  valueType: StateValueAnyKey = "any"
) {
  return this.varb(feVarbInfo).value(valueType);
}
export function findValue<T extends StateValueAnyKey>(
  this: Analyzer,
  varbInfo: SpecificVarbInfo,
  valueType?: T
): ValueTypesPlusAny[T] | undefined {
  const varb = this.findVarb(varbInfo);
  if (!varb) return undefined;
  return varb.value(valueType);
}
export function feValue<T extends StateValueAnyKey>(
  this: Analyzer,
  varbName: string,
  feInfo: SpecificSectionInfo,
  valueType?: T
): ValueTypesPlusAny[T];
export function feValue(
  this: Analyzer,
  varbName: string,
  feInfo: SpecificSectionInfo,
  valueType: StateValueAnyKey = "any"
) {
  return this.feVarb(varbName, feInfo).value(valueType);
}
export function varbInfoValues(this: Analyzer, feInfo: SpecificSectionInfo) {
  return this.section(feInfo).varbInfoValues();
}
export function outputValues(this: Analyzer, id: string) {
  return this.varbInfoValues({ sectionName: "output", id, idType: "feId" });
}
