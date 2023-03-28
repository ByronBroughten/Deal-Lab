import { pick } from "lodash";
import { defaultMaker } from "../defaultMaker/defaultMaker";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { FeSectionInfo, FeVarbInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { VarbInfoMixed } from "../SectionsMeta/SectionInfo/MixedSectionInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { GetterSections } from "../StateGetters/GetterSections";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { PackBuilderSections } from "../StatePackers.ts/PackBuilderSections";
import { StateSections } from "../StateSections/StateSections";
import { Arr } from "../utils/Arr";
import { OutEntityGetterVarb } from "./../StateInOutVarbs/OutEntityGetterVarb";
import { SolverSectionsBase } from "./SolverBases/SolverSectionsBase";
import { SolverPrepSection } from "./SolverPrepSection";
import { SolverPrepSections } from "./SolverPrepSections";
import { SolverSection } from "./SolverSection";
import tsort from "./SolverSections/tsort/tsort";
import { SolverVarb } from "./SolverVarb";

type OutVarbMap = Record<string, Set<string>>;

export class SolverSections extends SolverSectionsBase {
  get getterSections() {
    return new GetterSections(this.getterSectionsBase.getterSectionsProps);
  }
  get builderSections() {
    return new PackBuilderSections(this.getterSectionsBase.getterSectionsProps);
  }
  get prepperSections() {
    return new SolverPrepSections(this.solverSectionsProps);
  }
  oneAndOnly<SN extends SectionName>(sectionName: SN): SolverSection<SN> {
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
  outVarbGetterById(varbId: string): OutEntityGetterVarb {
    const feVarbInfo = GetterVarb.varbIdToVarbInfo(varbId);
    return new OutEntityGetterVarb({
      ...this.solverSectionsProps,
      ...feVarbInfo,
    });
  }
  solverVarbById(varbId: string): SolverVarb {
    const feVarbInfo = GetterVarb.varbIdToVarbInfo(varbId);
    return this.solverVarb(feVarbInfo);
  }
  prepperSection<S extends SectionName>(feInfo: FeSectionInfo<S>) {
    return new SolverPrepSection({
      ...this.solverSectionsProps,
      ...feInfo,
    });
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
  applyVariablesToDealPage(
    feInfo: FeSectionInfo<SectionNameByType<"dealSupports">>
  ): void {
    this.prepperSections.applyVariablesToDealPage(feInfo);
    this.solve();
  }
  applyVariablesToDealPages(): void {
    this.prepperSections.applyVariablesToDealPages();
    this.solve();
  }
  static initSectionsFromDefaultMain(): StateSections {
    const defaultMainPack = defaultMaker.makeSectionPack("main");
    const solver = this.initSolverFromMainPack(defaultMainPack);
    const { feId } = solver.onlyChild("feStore").youngestChild("dealMain").get;
    solver.solverSections.activateDealAndSolve(feId);
    return solver.sectionsShare.sections;
  }
  static initRoot(): SolverSection<"root"> {
    const sections = StateSections.initWithRoot();
    const rootSection = sections.rawSectionList("root")[0];
    return SolverSection.init({
      ...pick(rootSection, ["sectionName", "feId"]),
      ...SolverSectionsBase.initProps({
        sections,
      }),
    });
  }
  static initSolverFromMainPack(
    sectionPack: SectionPack<"main">
  ): SolverSection<"main"> {
    const solver = this.initRoot();
    solver.loadChildAndSolve({
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
  getActiveDeal(): SolverSection<"deal"> {
    const deal = this.prepperSections.getActiveDeal();
    return this.solverSection(deal.get.feInfo);
  }
  hasActiveDeal(): boolean {
    return this.prepperSections.hasActiveDeal();
  }
  activateDealAndSolve(feId: string): void {
    this.prepperSections.activateDeal(feId);
    this.solve();
  }
}
