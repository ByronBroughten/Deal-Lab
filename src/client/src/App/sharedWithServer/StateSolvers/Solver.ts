import { FeVarbInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSectionsProps } from "../StateGetters/Bases/GetterSectionsBase";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { OutEntityGetterVarb } from "../StateInOutVarbs/OutEntityGetterVarb";
import { SolveState } from "../StateSections/SolveState";
import { Arr } from "../utils/Arr";
import { EntityPrepperSections } from "./EntityPreppers/EntityPrepperSections";
import { SolverBase } from "./SolverBase";
import tsort from "./SolverSections/tsort/tsort";
import { SolverVarbNext } from "./SolverVarbNext";

type SolveShare = { solveState: SolveState };
export type HasSolveShare = {
  solveShare: SolveShare;
};

type OutVarbMap = Record<string, Set<string>>;

export interface SolverProps extends GetterSectionsProps, HasSolveShare {}

export class Solver extends SolverBase {
  private get entitySections() {
    return new EntityPrepperSections(
      this.getterSectionsBase.getterSectionsProps
    );
  }
  solverVarb<S extends SectionName>(
    feVarbInfo: FeVarbInfo<S>
  ): SolverVarbNext<S> {
    return new SolverVarbNext({
      ...this.solverProps,
      ...feVarbInfo,
    });
  }
  solve() {
    if (this.solveState.updateOutEntitiesOnSolve) {
      this.entitySections.addAppWideMissingOutEntities();
    }

    const orderedInfos = this.gatherAndSortInfosToSolve();
    for (let i = 0; i < orderedInfos.length; i++) {
      const varbInfo = orderedInfos[i];
      const solverVarb = this.solverVarb(varbInfo);
      solverVarb.solveAndUpdateValue();
    }
    this.resetSolveState();
  }
  private resetSolveState() {
    this.solveShare.solveState = SolveState.initEmpty();
  }
  private gatherAndSortInfosToSolve(): FeVarbInfo[] {
    const outVarbMap = this.getOutVarbMap();
    const { edges, loneVarbs } = this.getDagEdgesAndLoneVarbs(outVarbMap);
    let orderedVarbIds = tsort(edges);
    orderedVarbIds = orderedVarbIds.concat(loneVarbs);
    return orderedVarbIds.map((stringInfo) =>
      GetterVarb.varbIdToVarbInfo(stringInfo)
    );
  }
  private getDagEdgesAndLoneVarbs(outVarbMap: OutVarbMap) {
    const edges: [string, string][] = [];
    const loneVarbs = Object.keys(outVarbMap).filter(
      (k) => outVarbMap[k].size === 0
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
  private getOutVarbMap(): OutVarbMap {
    const outVarbMap: OutVarbMap = {};
    let varbIdsToSolveFor = [...this.varbIdsToSolveFor];

    while (varbIdsToSolveFor.length > 0) {
      const nextVarbsToSolveFor = [] as string[];
      for (const varbId of [...varbIdsToSolveFor]) {
        if (varbId in outVarbMap) continue;
        const { activeOutVarbIds } = this.outVarbGetterById(varbId);
        outVarbMap[varbId] = new Set(activeOutVarbIds);
        nextVarbsToSolveFor.push(...activeOutVarbIds);
      }
      varbIdsToSolveFor = nextVarbsToSolveFor;
    }
    return outVarbMap;
  }
  private outVarbGetterById(varbId: string): OutEntityGetterVarb {
    const feVarbInfo = GetterVarb.varbIdToVarbInfo(varbId);
    return new OutEntityGetterVarb({
      ...this.solverProps,
      ...feVarbInfo,
    });
  }
}
