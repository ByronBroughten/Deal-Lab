import tsort from "../Analyzer/methods/solveVarbs/tsort/tsort";
import { SharedSections } from "../HasInfoProps/HasSharedSectionsProp";
import {
  FeVarbInfo,
  SpecificVarbInfo,
} from "../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import FeVarb from "../SectionsState/FeSection/FeVarb";
import { FeSections } from "../SectionsState/SectionsState";
import { Arr } from "../utils/Arr";
import { VarbSolver } from "../VarbFocal/VarbSolver";

export interface SolverShared extends SharedSections {
  varbFullNamesToSolveFor: Set<string>;
}
export interface SolverSharedProps {
  shared: SolverShared;
}

type OutVarbMap = Record<string, Set<string>>;

export class SolverSections {
  constructor(readonly shared: SolverShared) {}
  get varbFullNamesToSolveFor(): Set<string> {
    return this.shared.varbFullNamesToSolveFor;
  }
  get sections(): FeSections {
    return this.shared.sections;
  }
  varbByMixed<SN extends SectionName<"hasVarb">>(
    mixedInfo: SpecificVarbInfo<SN>
  ): VarbSolver<SN> {
    const varb = this.sections.varbByMixed(mixedInfo);
    return new VarbSolver({
      ...varb.info,
      shared: this.shared,
    });
  }
  solve() {
    const orderedInfos = this.gatherAndSortInfosToSolve();
    for (const { id, varbName, sectionName } of orderedInfos) {
      const varbSolver = new VarbSolver({
        shared: this.shared,
        feId: id,
        sectionName,
        varbName,
      });
      varbSolver.solveAndUpdateValue();
    }
    this.resetVarbFullNamesToSolveFor();
  }

  private resetVarbFullNamesToSolveFor() {
    this.shared.varbFullNamesToSolveFor = new Set();
  }

  private gatherAndSortInfosToSolve(): FeVarbInfo[] {
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
        const outInfos = this.outVarbInfos(feVarbInfo);
        const outFullNames = outInfos.map((info) =>
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
  // this should go to varbSolver
}
