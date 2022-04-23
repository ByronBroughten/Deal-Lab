import Analyzer from "../../../Analyzer";
import { SectionFinder } from "../../../SectionMetas/baseSectionTypes";
import { Inf } from "../../../SectionMetas/Info";
import {
  FeVarbInfo,
  RelFindByFocalVarbInfo,
  SpecificVarbInfo,
} from "../../../SectionMetas/relSections/rel/relVarbInfoTypes";

export function displayNameOrNotFound(
  this: Analyzer,
  feVarbInfo: SpecificVarbInfo
): string {
  const varb = this.findVarb(feVarbInfo);
  if (!varb) return "Variable not found";
  else return this.displayName(feVarbInfo);
}
export function displayName(
  this: Analyzer,
  feVarbInfo: SpecificVarbInfo
): string {
  const { displayName } = this.varb(feVarbInfo);
  if (typeof displayName === "string") return displayName;
  const displayNameVarb = this.varbByFocal(feVarbInfo, displayName);
  return displayNameVarb.value("string");
}
export function displayNameVn(
  this: Analyzer,
  varbName: string,
  finder: SectionFinder
): string {
  const { feInfo } = this.section(finder);
  return this.displayName(Inf.feVarb(varbName, feInfo));
}

export function displayNameInfo(
  this: Analyzer,
  feVarbInfo: FeVarbInfo
): RelFindByFocalVarbInfo {
  const { displayName } = this.varb(feVarbInfo);
  if (typeof displayName === "string")
    throw new Error(`This displayName isn't mutable`);
  return displayName;
}
