import Analyzer from "../../Analyzer";
import array from "../../utils/Arr";
import { FeVarbInfo } from "../SectionMetas/relSections/rel/relVarbInfoTypes";
import { StateValue } from "../StateSection/StateVarb/stateValue";

export function solveVarbs(
  this: Analyzer,
  varbInfosToSolve: FeVarbInfo[]
): Analyzer {
  let next = this;
  varbInfosToSolve = array.rmDuplicateObjsClone(varbInfosToSolve);
  const orderedInfos = next.gatherAndSortInfosToSolve(varbInfosToSolve);
  for (const info of orderedInfos) {
    next = next.solveAndUpdateValue(info);
  }
  return next;
}

export function solveAllActiveVarbs(this: Analyzer) {
  const { feInfo } = this.singleSection("main");
  const activeNumObjInfos = this.nestedNumObjInfos(feInfo);
  return this.solveVarbs(activeNumObjInfos);
}
export function directUpdateAndSolve(
  this: Analyzer,
  feVarbInfo: FeVarbInfo,
  value: StateValue
) {
  let next = this;
  next = next.updateValueDirectly(feVarbInfo, value);
  return next.solveVarbs([feVarbInfo]);
}
