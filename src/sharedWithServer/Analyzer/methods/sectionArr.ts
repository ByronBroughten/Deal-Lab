import Analyzer from "../../Analyzer";
import { SectionOption } from "./entitiesVariables";
import { FeNameInfo } from "../SectionMetas/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../SectionMetas/SectionName";
import StateSection from "../StateSection";

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
export function setSectionArr(
  this: Analyzer,
  sectionName: SectionName,
  nextSectionArr: StateSection[]
): Analyzer {
  return new Analyzer({
    sections: {
      ...this.sections,
      [sectionName]: nextSectionArr,
    },
  });
}

export function sectionArrInfos<S extends SectionName = SectionName>(
  this: Analyzer,
  sectionName: S
): FeNameInfo<S>[] {
  return this.sectionArr(sectionName).map((section) => section.feInfo);
}

export function replaceInSectionArr(
  this: Analyzer,
  nextSection: StateSection
): Analyzer {
  const { feInfo } = nextSection;
  const { sectionName, id } = feInfo;

  const idx = this.sections[sectionName].findIndex(
    (nextSection) => nextSection.feId === id
  );

  if (idx === -1) throw Analyzer.sectionNotFound(feInfo);

  const nextSectionArr = [...this.sectionArr(sectionName)];
  nextSectionArr[idx] = nextSection;
  return this.setSectionArr(sectionName, nextSectionArr);
}

export function wipeSectionArrAndSolve(
  this: Analyzer,
  sectionName: SectionName
): Analyzer {
  const infos = this.sectionArr(sectionName).map(({ feInfo }) => feInfo);
  return this.eraseSectionsAndSolve(infos);
}
export function sectionOptions(
  this: Analyzer,
  sectionName: SectionName<"hasIndexStore">
): SectionOption[] {
  const storeName = this.sectionMeta(sectionName).indexStoreName;
  return this.sectionArr(storeName).map((section) => ({
    displayName: section.value("title", "string"),
    dbId: section.dbId,
  }));
}
