import tsort from "../Analyzer/methods/solveVarbs/tsort/tsort";
import { VarbSolver } from "../SectionFocal/VarbFocal/VarbSolver";
import {
  FeNameInfo,
  FeVarbInfo,
  LocalRelVarbInfo,
  RelVarbInfo,
  SpecificVarbInfo,
} from "../SectionsMeta/relSections/rel/relVarbInfoTypes";
import {
  isDefaultOutPack,
  isSwitchOutPack,
  OutUpdatePack,
} from "../SectionsMeta/VarbMeta";
import FeVarb from "../SectionsState/FeSection/FeVarb";
import { Arr } from "../utils/Arr";
import { SharedSections } from "./HasSharedSections";
import { UpdaterSections } from "./UpdaterSections";

export interface SolverSharedProps extends SharedSections {
  varbFullNamesToSolveFor?: Set<string>;
}
export interface SolverShared extends SolverSharedProps {
  varbFullNamesToSolveFor: Set<string>;
}

type OutVarbMap = Record<string, Set<string>>;

export class SolverSections extends UpdaterSections {
  readonly shared: SolverShared;
  constructor({
    varbFullNamesToSolveFor = new Set(),
    ...rest
  }: SolverSharedProps) {
    super(rest);
    this.shared = {
      varbFullNamesToSolveFor,
      ...rest,
    };
  }

  get varbFullNamesToSolveFor(): Set<string> {
    return this.shared.varbFullNamesToSolveFor;
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
      for (const stringInfo of [...this.varbFullNamesToSolveFor]) {
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
  private outVarbInfos(feVarbInfo: FeVarbInfo): FeVarbInfo[] {
    const { outEntities, outUpdatePacks } = this.varbByMixed(feVarbInfo);
    return [
      ...outEntities,
      ...outUpdatePacks.reduce((varbInfos, outUpdatePack) => {
        const { relTargetVarbInfo } = outUpdatePack;
        const targetVarbInfos = this.relativesToFeVarbInfos(
          feVarbInfo,
          relTargetVarbInfo
        );
        for (const targetVarbInfo of targetVarbInfos) {
          if (this.varbSwitchIsActive(targetVarbInfo, outUpdatePack))
            varbInfos.push(targetVarbInfo);
        }

        return varbInfos;
      }, [] as FeVarbInfo[]),
    ];
  }
  private relativesToFeVarbInfos(
    feInfo: FeNameInfo,
    relatives: RelVarbInfo | RelVarbInfo[]
  ): FeVarbInfo[] {
    if (!Array.isArray(relatives)) relatives = [relatives];
    let feVarbInfos: FeVarbInfo[] = [];
    for (const relVarbInfo of relatives) {
      const varbs = this.varbsByFocal(feInfo, relVarbInfo);
      const varbInfos = varbs.map((varb) => varb.feVarbInfo);
      feVarbInfos = feVarbInfos.concat(varbInfos);
    }
    return feVarbInfos;
  }
  private varbSwitchIsActive(
    switchFocal: FeVarbInfo,
    outUpdatePack: OutUpdatePack
  ): boolean {
    if (isSwitchOutPack(outUpdatePack)) {
      const { switchInfo, switchValue } = outUpdatePack;
      return this.switchIsActive(switchFocal, switchInfo, switchValue);
    } else if (isDefaultOutPack(outUpdatePack)) {
      const { inverseSwitches } = outUpdatePack;
      for (const { switchInfo, switchValue } of inverseSwitches) {
        if (this.switchIsActive(switchFocal, switchInfo, switchValue))
          return false;
      }
      return true;
    } else throw new Error(`Only switch and default outpacks work here.`);
  }
  private switchIsActive(
    focalInfo: SpecificVarbInfo,
    relSwitchInfo: LocalRelVarbInfo,
    switchValue: string
  ): boolean {
    return (
      switchValue === this.varbByFocal(focalInfo, relSwitchInfo).value("string")
    );
  }
}
