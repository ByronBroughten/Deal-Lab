import Analyzer from "../../Analyzer";
import { SectionName } from "../../SectionMetas/SectionName";
import StateSection from "../StateSection";
import { internal } from "./internal";

export function updateSectionArr(
  this: Analyzer,
  sectionName: SectionName,
  nextSectionArr: StateSection[]
): Analyzer {
  return this.updateAnalyzer({
    sections: {
      ...this.sections,
      [sectionName]: nextSectionArr,
    },
  });
}

export function wipeSectionArr(
  next: Analyzer,
  sectionName: SectionName
): Analyzer {
  const infos = next.sectionArr(sectionName).map(({ feInfo }) => feInfo);
  return internal.eraseSections(next, infos);
}

export function wipeSectionArrAndSolve(
  this: Analyzer,
  sectionName: SectionName
): Analyzer {
  const infos = this.sectionArr(sectionName).map(({ feInfo }) => feInfo);
  return this.eraseSectionsAndSolve(infos);
}
