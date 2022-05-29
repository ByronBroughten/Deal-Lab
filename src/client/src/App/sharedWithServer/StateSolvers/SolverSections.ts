import tsort from "../Analyzer/methods/solveVarbs/tsort/tsort";
import FeVarb from "../FeSections/FeSection/FeVarb";
import { VarbInfo } from "../SectionsMeta/Info";
import { SpecificVarbInfo } from "../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSections } from "../StateGetters/GetterSections";
import { Arr } from "../utils/Arr";
import { SolverSectionsBase } from "./SolverBases/SolverSectionsBase";
import { SolverVarb } from "./SolverVarb";

type OutVarbMap = Record<string, Set<string>>;

export class SolverSections extends SolverSectionsBase {
  private getterSections = new GetterSections(
    this.getterSectionsBase.sectionsShare
  );
  varbByMixed<SN extends SectionName<"hasVarb">>(
    mixedInfo: SpecificVarbInfo<SN>
  ): SolverVarb<SN> {
    const varb = this.getterSections.varbByMixed(mixedInfo);
    return this.solverVarb(varb.feVarbInfo);
  }
  solve() {
    const orderedInfos = this.gatherAndSortInfosToSolve();
    for (const varbInfo of orderedInfos) {
      const solverVarb = this.solverVarb(varbInfo);
      solverVarb.calculateAndUpdateValue();
    }
    this.resetVarbFullNamesToSolveFor();
  }

  private resetVarbFullNamesToSolveFor() {
    this.solveShare.varbFullNamesToSolveFor = new Set();
  }

  private gatherAndSortInfosToSolve(): VarbInfo[] {
    const { edges, loneVarbs } = this.getDagEdgesAndLoneVarbs();
    let solveOrder = tsort(edges);
    solveOrder = solveOrder.concat(loneVarbs);
    return solveOrder.map((stringInfo) =>
      FeVarb.fullNameToFeVarbInfo(stringInfo)
    );
  }

  private getDagEdgesAndLoneVarbs() {
    const outVarbMap = this.getOutVarbMap();
    const edges: [string, string][] = [];
    const loneVarbs = Object.keys(outVarbMap).filter(
      (k) => outVarbMap[k].size === 0
    );
    for (const [stringInfo, outStrings] of Object.entries(outVarbMap)) {
      for (const outString of outStrings) {
        if (loneVarbs.includes(outString))
          Arr.rmFirstValueMutate(loneVarbs, outString);
        edges.push([stringInfo, outString]);
      }
    }
    return { edges, loneVarbs };
  }

  private getOutVarbMap(): OutVarbMap {
    const outVarbMap: OutVarbMap = {};
    let varbFullNamesToSolveFor = [...this.varbFullNamesToSolveFor];
    while (varbFullNamesToSolveFor.length > 0) {
      const nextVarbsToSolveFor = [] as string[];
      for (const stringInfo of [...varbFullNamesToSolveFor]) {
        if (!(stringInfo in outVarbMap)) outVarbMap[stringInfo] = new Set();
        const feVarbInfo = FeVarb.fullNameToFeVarbInfo(stringInfo);
        const { outVarbInfos } = this.solverVarb(feVarbInfo);
        const outFullNames = outVarbInfos.map((info) =>
          FeVarb.feVarbInfoToFullName(info)
        );
        outFullNames.forEach((fullName) =>
          outVarbMap[stringInfo].add(fullName)
        );
        nextVarbsToSolveFor.push(...outFullNames);
      }
      varbFullNamesToSolveFor = nextVarbsToSolveFor;
    }
    return outVarbMap;
  }
  solverVarb<S extends SectionName>(feVarbInfo: VarbInfo<S>): SolverVarb<S> {
    return new SolverVarb({
      ...feVarbInfo,
      ...this.solverSectionsProps,
    });
  }
}
