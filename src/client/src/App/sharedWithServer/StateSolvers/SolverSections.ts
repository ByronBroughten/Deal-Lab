import { pick } from "lodash";
import {
  AddToStoreOptions,
  SolverFeStore,
} from "../../modules/FeStore/SolverFeStore";
import { defaultMaker } from "../defaultMaker/defaultMaker";
import { makeEmptyMain } from "../defaultMaker/makeEmptyMain";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { FeSectionInfo, FeVarbInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { VarbInfoMixed } from "../SectionsMeta/SectionInfo/MixedSectionInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { StoreSectionName } from "../SectionsMeta/sectionStores";
import { DealMode } from "../SectionsMeta/values/StateValue/dealMode";
import { GetterSections } from "../StateGetters/GetterSections";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { StoreId } from "../StateGetters/StoreId";
import { PackBuilderSections } from "../StatePackers/PackBuilderSections";
import { StateSections } from "../StateSections/StateSections";
import { Arr } from "../utils/Arr";
import { GetterSectionsProps } from "./../StateGetters/Bases/GetterSectionsBase";
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
  get feStore(): SolverFeStore {
    return new SolverFeStore(this.solverSectionsProps);
  }
  get stateSections(): StateSections {
    return this.sectionsShare.sections;
  }
  solve() {
    const orderedInfos = this.gatherAndSortInfosToSolve();
    for (let i = 0; i < orderedInfos.length; i++) {
      const varbInfo = orderedInfos[i];
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
  applyVariablesToDealSystem(feId: string): void {
    this.prepperSections.applyVariablesToDealSystem(feId);
    this.solve();
  }
  applyVariablesToDealSystems(): void {
    this.prepperSections.applyVariablesToDealSystems();
    this.solve();
  }
  static init(props: GetterSectionsProps) {
    return new SolverSections({
      solveShare: { varbIdsToSolveFor: new Set() },
      ...props,
    });
  }
  static initSectionsFromEmptyMain() {
    const mainPack = makeEmptyMain();
    const solver = this.initSolverFromMainPack(mainPack);
    return solver.solverSections;
  }
  static initSectionsFromDefaultMain(): StateSections {
    return this.initDefault().stateSections;
  }

  static initDefault(): SolverSections {
    const defaultMainPack = defaultMaker.makeSectionPack("main");
    const solver = this.initSolverFromMainPack(defaultMainPack);
    const { feId } = solver.onlyChild("feStore").youngestChild("dealMain").get;
    solver.solverSections.activateDealAndSolve({ feId });
    return solver.solverSections;
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
  addActiveDeal(dealMode: DealMode, options?: AddToStoreOptions<"dealMain">) {
    const { feStore } = this;
    feStore.addToStore({ storeName: "dealMain", options }, false);
    const newDeal = feStore.newestEntry("dealMain");
    const property = newDeal.onlyChild("property");

    newDeal.basicSolvePrepper.updateValues({ dealMode });
    property.basicSolvePrepper.updateValues({ propertyMode: dealMode });

    const sessionStore = this.oneAndOnly("sessionStore");
    sessionStore.updateValues({ isCreatingDeal: false });

    this.activateDealAndSolve({ feId: newDeal.get.feId });
  }
  get activeDealSystem(): SolverSection<"dealSystem"> {
    const main = this.oneAndOnly("main");
    return main.onlyChild("activeDealSystem");
  }

  saveAndOverwriteToStore(feInfo: FeSectionInfo<StoreSectionName>) {
    const section = this.getterSections.section(feInfo);
    this.feStore.saveAndOverwriteToStore({
      storeName: section.mainStoreName,
      sectionPack: section.makeSectionPack(),
    });
  }
  deactivateDealIfActive(feId: string) {
    if (this.getterSections.isActiveDeal(feId)) {
      this.prepperSections.deactivateDealAndDealSystem();
    }
  }
  archiveDeal(feId: string) {
    this.deactivateDealIfActive(feId);
    const deal = this.solverSection({
      sectionName: "deal",
      feId,
    });
    deal.updateValues({ isArchived: true });
    this.feStore.addChangeToSave(deal.get.mainStoreId, {
      changeName: "update",
    });
  }
  loadAndShowArchivedDeals(archivedDeals: SectionPack<"deal">[]) {
    this.feStore.loadChildrenNoDuplicates("dealMain", archivedDeals);
    const sessionStore = this.oneAndOnly("sessionStore");
    sessionStore.basicSolvePrepper.updateValues({
      showArchivedDeals: true,
      archivedAreLoaded: true,
    });
  }
  removeStoredDeal(feId: string) {
    this.deactivateDealIfActive(feId);

    const deal = this.solverSection({ sectionName: "deal", feId });
    const compareMenu = this.oneAndOnly("dealCompareMenu");
    if (
      compareMenu.get.hasChildByDbInfo({
        childName: "comparedDeal",
        dbId: deal.get.dbId,
      })
    ) {
      this.removeDealFromDealCompare(feId);
    }
    this.feStore.removeFromStore({ storeName: "dealMain", feId });
  }

  addDealSystemToCompare(dbId: string) {
    const menu = this.oneAndOnly("dealCompareCache");
    const feStore = this.oneAndOnly("feStore");

    const dealSystem = menu.addAndGetChild("comparedDealSystem", { dbId });
    const dealToCompare = dealSystem.onlyChild("deal");

    const deal = feStore.childByDbId({ childName: "dealMain", dbId });
    dealToCompare.loadSelfAndSolve(deal.packMaker.makeSectionPack());
  }
  addDealToCompare(feId: string) {
    const { feStore } = this;

    const menu = this.oneAndOnly("dealCompareMenu");
    const cache = this.oneAndOnly("dealCompareCache");

    const storeId = StoreId.make("dealCompareMenu", menu.get.feId);
    feStore.addChangeToSave(storeId, { changeName: "update" });

    const deal = feStore.get.child({ childName: "dealMain", feId });
    const dbId = deal.dbId;

    menu.basicSolvePrepper.addChild("comparedDeal", { dbId });

    if (
      !cache.get.hasChildByDbInfo({ childName: "comparedDealSystem", dbId })
    ) {
      this.addDealSystemToCompare(dbId);
    }

    const dealSystems = cache.children("comparedDealSystem");
    const dealCount = dealSystems.length;
    if (dealCount === 1) {
      menu.updateValues({ dealMode: deal.valueNext("dealMode") });
    }
  }
  removeDealFromDealCompare(feId: string) {
    const compareMenu = this.oneAndOnly("dealCompareMenu");

    const { dbId } = this.solverSection({
      sectionName: "dealSystem",
      feId,
    }).get;
    const comparedDeal = compareMenu.childByDbId({
      childName: "comparedDeal",
      dbId,
    });

    comparedDeal.removeSelfAndSolve();
    const storeId = StoreId.make("dealCompareMenu", compareMenu.get.feId);
    this.feStore.addChangeToSave(storeId, { changeName: "update" });
  }
  activateDealAndSolve({
    feId,
    finishEditLoading,
  }: {
    feId: string;
    finishEditLoading?: boolean;
  }): void {
    this.prepperSections.activateDeal(feId);

    if (finishEditLoading) {
      const session = this.prepperSections.oneAndOnly("sessionStore");
      session.updateValues({ dealDbIdToEdit: "" });
    }

    this.prepperSections.addAppWideMissingOutEntities();
    this.solve();
  }
}
