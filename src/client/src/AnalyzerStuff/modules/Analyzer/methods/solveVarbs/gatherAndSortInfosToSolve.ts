import { FeVarbInfo } from "../../../../../App/sharedWithServer/SectionsMeta/relSections/rel/relVarbInfoTypes";
import tsort from "../../../../../App/sharedWithServer/StateSolvers/SolverSections/tsort/tsort";
import { Arr } from "../../../../../App/sharedWithServer/utils/Arr";
import Analyzer from "../../../Analyzer";
import StateVarb from "../../StateSection/StateVarb";

type OutVarbMap = Record<string, string[]>;
export function getOutVarbMap(
  this: Analyzer,
  feInfosToSolve: FeVarbInfo[],
  outVarbMap: OutVarbMap = {},
  visitedInfos: string[] = [],
  parentStringInfo?: string
): OutVarbMap {
  for (const info of feInfosToSolve) {
    const stringInfo = StateVarb.feVarbInfoToVarbId(info);
    if (visitedInfos.includes(stringInfo)) continue;
    if (!(stringInfo in outVarbMap)) outVarbMap[stringInfo] = [];
    if (parentStringInfo && !outVarbMap[parentStringInfo].includes(stringInfo))
      outVarbMap[parentStringInfo].push(stringInfo);
    visitedInfos.push(stringInfo);
    const outInfos = this.outVarbInfos(info);
    this.getOutVarbMap(outInfos, outVarbMap, visitedInfos, stringInfo);
  }
  return outVarbMap;
}

export function getDagEdgesAndLoneVarbs(
  this: Analyzer,
  varbInfosToSolve: FeVarbInfo[]
) {
  // Many of the switches end up as loneVarbs.
  // I'm not sure if that's detrimental.
  const outVarbMap = this.getOutVarbMap(varbInfosToSolve);
  const edges: [string, string][] = [];
  const loneVarbs = Object.keys(outVarbMap).filter(
    (k) => outVarbMap[k].length === 0
  );
  for (const [stringInfo, outStrings] of Object.entries(outVarbMap)) {
    for (const outString of outStrings) {
      if (loneVarbs.includes(outString))
        Arr.rmFirstMatchMutate(loneVarbs, outString);
      edges.push([stringInfo, outString]);
    }
  }
  return { edges, loneVarbs };
}

export function gatherAndSortInfosToSolve(
  this: Analyzer,
  varbInfosToSolve: FeVarbInfo[]
): FeVarbInfo[] {
  const { edges, loneVarbs } = this.getDagEdgesAndLoneVarbs(varbInfosToSolve);
  let solveOrder = tsort(edges);
  solveOrder = solveOrder.concat(loneVarbs);
  return solveOrder.map((stringInfo) =>
    StateVarb.varbIdToFeVarbInfo(stringInfo)
  );
}
