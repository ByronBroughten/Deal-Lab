import Analyzer from "../../../Analyzer";
import { FeNameInfo } from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import StateSection from "../../StateSection";
import { SectionOption } from "./variableOptions";

export function sectionArr<S extends SectionName>(
  this: Analyzer,
  sectionName: S,
  feIds?: string[]
): StateSection<S>[] {
  let sectionArr = this.sections[sectionName] as StateSection<SectionName>[];
  if (feIds)
    sectionArr = sectionArr.filter((section) => feIds.includes(section.feId));
  return sectionArr as any as StateSection<S>[];
}
export function sectionArrInfos<S extends SectionName = SectionName>(
  this: Analyzer,
  sectionName: S
): FeNameInfo<S>[] {
  return this.sectionArr(sectionName).map((section) => section.feInfo);
}
export function sectionArrAsOptions(
  this: Analyzer,
  sectionName: SectionName<"hasIndexStore">
): SectionOption[] {
  const storeName = this.sectionMeta(sectionName).indexStoreName;
  return this.sectionArr(storeName).map((section) => ({
    displayName: section.value("title", "string"),
    dbId: section.dbId,
  }));
}
