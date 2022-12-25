import { pick } from "lodash";
import { defaultMaker } from "../defaultMaker/defaultMaker";
import { FeStoreNameByType } from "../SectionsMeta/relSectionsDerived/FeStoreName";
import { VarbInfoMixed } from "../SectionsMeta/sectionChildrenDerived/MixedSectionInfo";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { FeSectionInfo, FeVarbInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { GetterSections } from "../StateGetters/GetterSections";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { PackBuilderSections } from "../StatePackers.ts/PackBuilderSections";
import { SectionPackArrs } from "../StatePackers.ts/PackMakerSection";
import { StateSections } from "../StateSections/StateSections";
import { UpdaterSection } from "../StateUpdaters/UpdaterSection";
import { Arr } from "../utils/Arr";
import { OutVarbGetterVarb } from "./../StateInOutVarbs/OutVarbGetterVarb";
import { SolverSectionsBase } from "./SolverBases/SolverSectionsBase";
import { SolverSection } from "./SolverSection";
import tsort from "./SolverSections/tsort/tsort";
import { SolverVarb } from "./SolverVarb";

type OutVarbMap = Record<string, Set<string>>;

export class SolverSections extends SolverSectionsBase {
  private get getterSections() {
    return new GetterSections(this.getterSectionsBase.getterSectionsProps);
  }
  get builderSections() {
    return new PackBuilderSections(this.getterSectionsBase.getterSectionsProps);
  }
  oneAndOnly<SN extends SectionName>(sectionName: SN) {
    const { feInfo } = this.getterSections.oneAndOnly(sectionName);
    return this.solverSection(feInfo);
  }
  varbByMixed<SN extends SectionNameByType<"hasVarb">>(
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
  private gatherAndSortInfosToSolve(): FeVarbInfo[] {
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
        const { activeOutVarbIds } = this.outVarbGetterById(varbId);
        outVarbMap[varbId] = new Set(activeOutVarbIds);
        nextVarbsToSolveFor.push(...activeOutVarbIds);
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
  solverSection<S extends SectionName>(
    feInfo: FeSectionInfo<S>
  ): SolverSection<S> {
    return new SolverSection({
      ...this.solverSectionsProps,
      ...feInfo,
    });
  }
  solverVarb<S extends SectionName>(feVarbInfo: FeVarbInfo<S>): SolverVarb<S> {
    return new SolverVarb({
      ...this.solverSectionsProps,
      ...feVarbInfo,
    });
  }
  static initSectionsFromDefaultMain(): StateSections {
    const defaultMainPack = defaultMaker.makeSectionPack("main");
    return this.initSolvedSectionsFromMainPack(defaultMainPack);
  }
  static initRoot(): SolverSection<"root"> {
    const sections = StateSections.initWithRoot();
    const rootSection = sections.rawSectionList("root")[0];
    return SolverSection.init({
      ...pick(rootSection, ["sectionName", "feId"]),
      ...SolverSectionsBase.initProps({
        sections,
        sectionContextName: "default",
      }),
    });
  }
  static initMainFromActiveDealPack(
    sectionPack: SectionPack<"deal">
  ): SolverSection<"main"> {
    const solver = this.initRoot();
    const mainSolver = solver.addAndGetChild("main");
    const activeDeal = mainSolver.onlyChild("activeDeal");
    activeDeal.loadSelf(sectionPack);
    return mainSolver;
  }
  static initFromFeUserPack(
    sectionPack: SectionPack<"feUser">
  ): SolverSection<"feUser"> {
    const solver = this.initRoot();
    const mainSolver = solver.addAndGetChild("main");
    mainSolver.loadChild({
      childName: "feUser",
      sectionPack,
    });
    return mainSolver.onlyChild("feUser");
  }
  static initSolverFromMainPack(
    sectionPack: SectionPack<"main">
  ): SolverSection<"main"> {
    const solver = this.initRoot();
    solver.loadChild({
      childName: "main",
      sectionPack,
    });
    return solver.onlyChild("main");
  }
  static initSolvedSectionsFromMainPack(
    sectionPack: SectionPack<"main">
  ): StateSections {
    const main = this.initSolverFromMainPack(sectionPack);
    return main.sectionsShare.sections;
  }
  static initSaveUserListSections(
    activeDealPack: SectionPack<"deal">,
    packArrs: SectionPackArrs<"feUser", FeStoreNameByType<"saveUserLists">>
  ): StateSections {
    const props = UpdaterSection.initMainSectionPropsWithEmptyUser();
    const main = SolverSection.init(props);
    const mainAdder = main.adder;
    mainAdder.loadChild({
      childName: "activeDeal",
      sectionPack: activeDealPack,
    });
    const userAdder = mainAdder.onlyChild("feUser");
    userAdder.loadChildArrsAndFinalize(packArrs);
    main.solve();
    return main.sectionsShare.sections;
  }
}
