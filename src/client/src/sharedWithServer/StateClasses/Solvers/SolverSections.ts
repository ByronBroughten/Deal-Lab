import { pick } from "lodash";
import { SolverFeStore } from "../../../App/modules/FeStore/SolverFeStore";
import { StoreId } from "../../Ids/StoreId";
import { FeSectionInfo, FeVarbInfo } from "../../SectionInfo/FeInfo";
import { SectionPack } from "../../SectionPack/SectionPack";
import { SolveState } from "../../State/SolveState";
import { StateSections } from "../../State/StateSections";
import { GetterSections } from "../../StateGetters/GetterSections";
import { defaultMaker } from "../../defaultMaker/defaultMaker";
import { StoreSectionName } from "../../sectionStores";
import { SectionName } from "../../sectionVarbsConfig/SectionName";
import { PackBuilderSections } from "../Packers/PackBuilderSections";

import { GetterSectionsProps } from "../../StateGetters/Bases/GetterSectionsBase";
import { SolvePrepper } from "../SolvePreppers/SolvePrepper";
import { SolverSectionsBase } from "../SolverBases/SolverSectionsBase";
import { Solver } from "./Solver";
import { SolverSection } from "./SolverSection";
import { SolverVarb } from "./SolverVarb";

export class SolverSections extends SolverSectionsBase {
  get solver() {
    return new Solver(this.solverSectionsProps);
  }
  get getterSections() {
    return new GetterSections(this.getterSectionsBase.getterSectionsProps);
  }
  get builderSections() {
    return new PackBuilderSections(this.getterSectionsBase.getterSectionsProps);
  }
  get solvePrepper(): SolvePrepper {
    return new SolvePrepper(this.solverSectionsProps);
  }
  oneAndOnly<SN extends SectionName>(sectionName: SN): SolverSection<SN> {
    const { feInfo } = this.getterSections.oneAndOnly(sectionName);
    return this.solverSection(feInfo);
  }
  get feStore(): SolverFeStore {
    return new SolverFeStore(this.solverSectionsProps);
  }
  solve() {
    this.solver.solve();
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

  static init(props: GetterSectionsProps) {
    return new SolverSections({
      solveShare: { solveState: SolveState.initEmpty() },
      ...props,
    });
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
  saveAndOverwriteToStore(feInfo: FeSectionInfo<StoreSectionName>) {
    const section = this.getterSections.section(feInfo);
    this.feStore.saveAndOverwriteToStore({
      storeName: section.mainStoreName,
      sectionPack: section.makeSectionPack(),
    });
  }
  deactivateDealByDbIdIfActive(dbId: string) {
    if (this.getterSections.isActiveDealByDbId(dbId)) {
      this.solvePrepper.deactivateDealAndDealSystem();
    }
  }
  deactivateDealIfActive(feId: string) {
    if (this.getterSections.isActiveDeal(feId)) {
      this.solvePrepper.deactivateDealAndDealSystem();
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
    sessionStore.basic.updateValues({
      showArchivedDeals: true,
      archivedAreLoaded: true,
    });
  }
  removeStoredDeal(dbId: string) {
    this.deactivateDealByDbIdIfActive(dbId);

    const childInfo = { childName: "dealMain", dbId } as const;

    const { feStore } = this;
    if (feStore.get.hasChildByDbInfo(childInfo)) {
      feStore.removeFromStoreByDbId({ storeName: "dealMain", dbId });
      // this removes both the feStore and sessionVersion
    }

    const compareMenu = this.oneAndOnly("dealCompareMenu");
    if (
      compareMenu.get.hasChildByDbInfo({
        childName: "comparedDeal",
        dbId,
      })
    ) {
      this.removeDealFromDealCompareMenu(dbId);
    }
    this.solve();
  }
  doDealCompare() {
    const { feStore } = this;
    const dealDbIds = feStore.get.childrenDbIds("dealMain");

    const menu = this.oneAndOnly("dealCompareMenu");
    for (const dbId of menu.get.childrenDbIds("comparedDeal")) {
      if (!dealDbIds.includes(dbId)) {
        const compareDeal = menu.childByDbId({
          childName: "comparedDeal",
          dbId,
        });
        compareDeal.basic.removeSelf();
      }
    }

    const compareDbIds = menu.get.childrenDbIds("comparedDeal");
    const cache = this.oneAndOnly("dealCompareCache");
    for (const system of cache.children("comparedDealSystem")) {
      if (!compareDbIds.includes(system.get.dbId)) {
        system.basic.removeSelf();
      }
    }

    for (const dbId of compareDbIds) {
      if (
        !cache.get.hasChildByDbInfo({
          childName: "comparedDealSystem",
          dbId,
        })
      ) {
        this.addDealSystemToCompareCache(dbId);
      }
    }

    const session = this.oneAndOnly("sessionStore");
    session.basic.updateValues({ compareDealStatus: "comparing" });
    this.solve();
  }
  private addDealSystemToCompareCache(dbId: string) {
    const cache = this.oneAndOnly("dealCompareCache");
    const feStore = this.oneAndOnly("feStore");

    const dealSystem = cache.addAndGetChild("comparedDealSystem", { dbId });
    const dealToCompare = dealSystem.onlyChild("deal");

    const deal = feStore.childByDbId({ childName: "dealMain", dbId });
    dealToCompare.basic.loadSelfSectionPack(deal.packMaker.makeSectionPack());
  }

  private removeDealFromDealCompareMenu(dbId: string) {
    const compareMenu = this.oneAndOnly("dealCompareMenu");
    compareMenu.basic.removeChildByDbId({
      childName: "comparedDeal",
      dbId,
    });
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
    this.solvePrepper.activateDeal(feId, finishEditLoading);
    this.solve();
  }
}
