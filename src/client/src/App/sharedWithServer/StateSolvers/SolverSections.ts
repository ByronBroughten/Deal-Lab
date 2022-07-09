import { pick } from "lodash";
import { defaultMaker } from "../defaultMaker/defaultMaker";
import { SectionPack } from "../SectionPack/SectionPack";
import { VarbInfoMixed } from "../SectionsMeta/childSectionsDerived/MixedSectionInfo";
import { VarbInfo } from "../SectionsMeta/Info";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSections } from "../StateGetters/GetterSections";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { StateSections } from "../StateSections/StateSections";
import { Arr } from "../utils/Arr";
import { OutVarbGetterVarb } from "./../StateInOutVarbs/OutVarbGetterVarb";
import { SolverSectionsBase } from "./SolverBases/SolverSectionsBase";
import { SolverSection } from "./SolverSection";
import tsort from "./SolverSections/tsort/tsort";
import { SolverVarb } from "./SolverVarb";

type OutVarbMap = Record<string, Set<string>>;

export class SolverSections extends SolverSectionsBase {
  private getterSections = new GetterSections(
    this.getterSectionsBase.getterSectionsProps
  );
  varbByMixed<SN extends SectionName<"hasVarb">>(
    mixedInfo: VarbInfoMixed<SN>
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
    this.solveShare.varbIdsToSolveFor = new Set();
  }
  // how did I use a switch to differentiate those before?
  // or
  private gatherAndSortInfosToSolve(): VarbInfo[] {
    const outVarbMap = this.getOutVarbMap();
    const { edges, loneVarbs } = this.getDagEdgesAndLoneVarbs(outVarbMap);
    let orderedVarbIds = tsort(edges); // tsort must have found a circularity issue
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

        const { outVarbIds } = this.outVarbGetterById(varbId);
        // outVarbIds.forEach((id) => {
        //   if (outVarbMap[id].has(varbId)) return;
        //   outVarbMap[varbId].add(id);
        // })
        outVarbMap[varbId] = new Set(outVarbIds);
        nextVarbsToSolveFor.push(...outVarbIds);
      }
      varbIdsToSolveFor = nextVarbsToSolveFor;
    }
    return outVarbMap;
  }
  outVarbGetterById(varbId: string): OutVarbGetterVarb {
    const feVarbInfo = GetterVarb.varbIdToVarbInfo(varbId);
    return new OutVarbGetterVarb({
      ...this.solverSectionsProps,
      ...feVarbInfo,
    });
  }
  solverVarbById(varbId: string): SolverVarb {
    const feVarbInfo = GetterVarb.varbIdToVarbInfo(varbId);
    return this.solverVarb(feVarbInfo);
  }
  solverVarb<S extends SectionName>(feVarbInfo: VarbInfo<S>): SolverVarb<S> {
    return new SolverVarb({
      ...this.solverSectionsProps,
      ...feVarbInfo,
    });
  }
  static initSectionsFromDefaultMain(): StateSections {
    const defaultMainPack = defaultMaker.makeSectionPack("main");
    return this.initSolvedSectionsFromMainPack(defaultMainPack);
  }
  static initSolvedSectionsFromMainPack(
    sectionPack: SectionPack<"main">
  ): StateSections {
    const sections = StateSections.initWithRoot();
    const rootSection = sections.rawSectionList("root")[0];
    const solver = SolverSection.init({
      ...pick(rootSection, ["sectionName", "feId"]),
      sectionsShare: { sections },
    });
    solver.loadChildPackAndSolve({
      childName: "main",
      sectionPack,
    });
    return solver.sectionsShare.sections;
  }
}
