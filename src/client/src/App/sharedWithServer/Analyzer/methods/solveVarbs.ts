import Analyzer from "../../Analyzer";
import array from "../../utils/Arr";
import { FeVarbInfo } from "../SectionMetas/relSections/rel/relVarbInfoTypes";
import { solveAndUpdateValue } from "./solveVarbs/solveAndUpdateValue";

export function solveVarbs(
  this: Analyzer,
  varbInfosToSolve: FeVarbInfo[] = []
): Analyzer {
  let next = this;
  varbInfosToSolve.push(...next.getVarbInfosToSolveFor());
  varbInfosToSolve = array.rmDuplicateObjsClone(varbInfosToSolve);

  const orderedInfos = next.gatherAndSortInfosToSolve(varbInfosToSolve);
  for (const info of orderedInfos) {
    next = solveAndUpdateValue(next, info);
  }

  return next.updateAnalyzer({
    varbFullNamesToSolveFor: new Set(),
  });
}

export function solveAllActiveVarbs(this: Analyzer) {
  const { feInfo } = this.singleSection("main");
  const activeNumObjInfos = this.nestedNumObjInfos(feInfo);
  return this.solveVarbs(activeNumObjInfos);
}
