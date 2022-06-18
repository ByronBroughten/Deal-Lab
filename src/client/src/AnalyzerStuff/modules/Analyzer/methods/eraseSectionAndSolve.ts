import { FeInfo } from "../../../../App/sharedWithServer/SectionsMeta/Info";
import { SpecificSectionInfo } from "../../../../App/sharedWithServer/SectionsMeta/relSections/rel/relVarbInfoTypes";
import Analyzer from "../../Analyzer";
import { internal } from "./internal";

export function eraseSectionAndSolve(
  this: Analyzer,
  info: SpecificSectionInfo
): Analyzer {
  const { feInfo } = this.section(info);
  const next = internal.eraseSectionAndChildren(this, feInfo);
  return next.solveVarbs();
}

export function eraseSections(next: Analyzer, feInfos: FeInfo[]) {
  return feInfos.reduce((next, feInfo) => {
    return internal.eraseSectionAndChildren(next, feInfo);
  }, next);
}

export function eraseSectionsAndSolve(
  this: Analyzer,
  feInfos: FeInfo[]
): Analyzer {
  const next = internal.eraseSections(this, feInfos);
  return next.solveVarbs();
}
