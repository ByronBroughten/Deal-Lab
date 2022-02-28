import Analyzer from "../../Analyzer";
import { SectionFinder } from "../SectionMetas/relSections/baseNameArrs";
import { SectionName } from "../SectionMetas/SectionName";
import { ResetSectionOptions } from "./protected/resetSection";

export function resetSectionAndSolve(
  this: Analyzer,
  finder: SectionFinder<SectionName<"hasParent">>,
  options: ResetSectionOptions = {}
): Analyzer {
  const [next, allAffectedInfos] = this.resetSection(finder, options);
  return next.solveVarbs(allAffectedInfos);
}
