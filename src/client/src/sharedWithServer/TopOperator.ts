import { GetterFeStore } from "../App/modules/FeStore/GetterFeStore";
import {
  AddToStoreOptions,
  PrepperFeStore,
} from "../App/modules/FeStore/PrepperFeStore";
import { isStoreNameByType, StoreSectionName } from "./sectionStores";
import { MainState, MainStateProps } from "./State/MainState";
import { GetterSections } from "./StateGetters/GetterSections";
import { FeSectionInfo } from "./StateGetters/Identifiers/FeInfo";
import { DbIdProp } from "./StateGetters/Identifiers/NanoIdInfo";
import { StoreId } from "./StateGetters/Identifiers/StoreId";
import { defaultMaker } from "./StateOperators/defaultMaker/defaultMaker";
import { makeDefaultSessionDeal } from "./StateOperators/defaultMaker/defaultSessionDeal";
import { makeEmptyMain } from "./StateOperators/defaultMaker/makeEmptyMain";
import { SolvePrepper } from "./StateOperators/SolvePreppers/SolvePrepper";
import { SolvePrepperSection } from "./StateOperators/SolvePreppers/SolvePrepperSection";
import { SolverBase } from "./StateOperators/SolverBases/SolverBase";
import { Solver } from "./StateOperators/Solvers/Solver";
import { DealMode } from "./stateSchemas/StateValue/dealMode";
import { SectionPack } from "./StateTransports/SectionPack";
import { UserData } from "./StateTransports/UserData";
import { Obj } from "./utils/Obj";
import { timeS } from "./utils/timeS";

export class TopOperator extends SolverBase {
  get prepper() {
    return new SolvePrepper(this.solverProps);
  }
  get solver() {
    return new Solver(this.solverProps);
  }
  get getStore(): GetterFeStore {
    return new GetterFeStore(this.solverProps);
  }
  get prepStore(): PrepperFeStore {
    return new PrepperFeStore(this.solverProps);
  }
  get getterSections(): GetterSections {
    return new GetterSections(this.getterSectionsBase.getterSectionsProps);
  }
  get mainStateProps(): MainStateProps {
    return {
      solveState: this.solveState,
      stateSections: this.stateSections,
    };
  }
  makeMainState(): MainState {
    return new MainState(this.mainStateProps);
  }
  solve(): TopOperator {
    this.solver.solve();
    return this;
  }
  makeEmptyMainAndSolve() {
    const main = this.prepper.oneAndOnly("main");
    main.loadSelfSectionPack(makeEmptyMain());
    this.solve();
  }
  doLoginAndSolve(): void {
    const main = this.prepper.oneAndOnly("main");
    main.loadSelfSectionPack(defaultMaker.makeSectionPack("main"));
    const feStore = main.onlyChild("feStore");
    feStore.updateValues({ userDataStatus: "loading" });
    this.solve();
  }
  loadUserDataAndSolve(userData: UserData): void {
    this.prepper.deactivateDealAndDealSystem();

    const sessionStore = this.prepper.oneAndOnly("sessionStore");
    sessionStore.loadSelfSectionPack(userData.sessionStore);

    const feStore = this.prepper.oneAndOnly("feStore");
    feStore.loadSelfSectionPack(userData.feStore);
    feStore.updateValues({ userDataFetchTryCount: 0 });

    this.prepper.applyVariablesToDealSystems();
  }
  incrementGetUserDataTry() {
    const feStore = this.prepper.oneAndOnly("feStore");
    const count = feStore.get.valueNext("userDataFetchTryCount");
    feStore.updateValues({
      userDataFetchTryCount: count + 1,
    });
  }
  onChangeIdle(): void {
    const feStore = this.prepper.oneAndOnly("feStore");
    feStore.updater.updateValues({
      timeOfChangeIdle: timeS.now(),
    });

    const { areSomeToSave, noneSaving } = this.getStore;
    if (areSomeToSave && noneSaving) {
      this.initiateSave();
    }
  }
  private initiateSave() {
    this.preSaveAndSolve();
    const feStore = this.prepper.oneAndOnly("feStore");
    feStore.updateValues({
      timeOfSave: timeS.now(),
      changesSaving: this.getStore.toSaveToSaving(),
      changesToSave: {},
    });
    this.solve();
  }
  private preSaveAndSolve() {
    const { getStore } = this;
    const changesToSave = getStore.get.valueNext("changesToSave");
    const storeIds = Obj.keys(changesToSave);

    let doVariableUpdate = false;
    for (const storeId of storeIds) {
      const change = changesToSave[storeId];
      const { storeName, feId } = StoreId.split(storeId);
      if (isStoreNameByType(storeName, "variableStore")) {
        doVariableUpdate = true;
        break;
      }
      if (storeName === "dealMain" && change.changeName === "update") {
        const deal = getStore.get.child({ childName: storeName, feId });
        this.doDealUpdate(deal.dbId);
      }
    }
    if (doVariableUpdate) {
      this.prepper.applyVariablesToDealSystems();
    }
  }
  private doDealUpdate(dbId: string) {
    const deal = this.getStore.get.childByDbId({ childName: "dealMain", dbId });
    const session = this.prepper.oneAndOnly("sessionStore");
    const sessionDeal = session.childByDbId({ childName: "dealMain", dbId });
    sessionDeal.loadSelfSectionPack(makeDefaultSessionDeal(deal));
  }
  loadCopyFromStore({
    dbId,
    sectionName,
    feId,
  }: FeSectionInfo<StoreSectionName> & DbIdProp) {
    const section = this.prepper.prepperSection({ sectionName, feId });
    const { mainStoreName } = section.get;
    const stored = this.getStore.get.childByDbId({
      childName: mainStoreName,
      dbId,
    });
    section.loadSelfSectionPack(stored.makeSectionPack());
    section.updater.newDbId();
  }
  saveAndOverwriteToStore(feInfo: FeSectionInfo<StoreSectionName>) {
    const section = this.getterSections.section(feInfo);
    this.prepStore.saveAndOverwriteToStore({
      storeName: section.mainStoreName,
      sectionPack: section.makeSectionPack(),
    });
  }
  archiveDeal(feId: string) {
    this.prepper.deactivateDealIfActive(feId);
    const deal = this.prepper.prepperSection({
      sectionName: "deal",
      feId,
    });
    deal.updateValues({ isArchived: true });
    this.prepStore.addChangeToSave(deal.get.mainStoreId, {
      changeName: "update",
    });
  }
  loadAndShowArchivedDeals(archivedDeals: SectionPack<"deal">[]) {
    this.prepStore.loadChildrenNoDuplicates("dealMain", archivedDeals);
    const sessionStore = this.prepper.oneAndOnly("sessionStore");
    sessionStore.updateValues({
      showArchivedDeals: true,
      archivedAreLoaded: true,
    });
  }
  removeStoredDealAndSolve(dbId: string) {
    this.deactivateDealByDbIdIfActive(dbId);

    const childInfo = { childName: "dealMain", dbId } as const;

    const { prepStore } = this;
    if (prepStore.get.hasChildByDbInfo(childInfo)) {
      prepStore.removeFromStoreByDbId({ storeName: "dealMain", dbId });
      // this removes both the feStore and sessionVersion
    }

    const compareMenu = this.prepper.oneAndOnly("dealCompareMenu");
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
  deactivateDealByDbIdIfActive(dbId: string): void {
    if (this.getterSections.isActiveDealByDbId(dbId)) {
      this.prepper.deactivateDealAndDealSystem();
    }
  }
  private removeDealFromDealCompareMenu(dbId: string) {
    const compareMenu = this.prepper.oneAndOnly("dealCompareMenu");
    compareMenu.removeChildByDbId({
      childName: "comparedDeal",
      dbId,
    });
    const storeId = StoreId.make("dealCompareMenu", compareMenu.get.feId);
    this.prepStore.addChangeToSave(storeId, { changeName: "update" });
  }
  addActiveDealAndSolve(
    dealMode: DealMode,
    options?: AddToStoreOptions<"dealMain">
  ) {
    const { prepStore } = this;
    prepStore.addToStore({ storeName: "dealMain", options });
    const newDeal = prepStore.newestEntry("dealMain");
    const property = newDeal.onlyChild("property");

    newDeal.updateValues({ dealMode });
    property.updateValues({ propertyMode: dealMode });

    const sessionStore = this.prepper.oneAndOnly("sessionStore");
    sessionStore.updateValues({ isCreatingDeal: false });

    this.activateDealAndSolve({ feId: newDeal.get.feId });
  }
  activateDealAndSolve({
    feId,
    finishEditLoading,
  }: {
    feId: string;
    finishEditLoading?: boolean;
  }): void {
    this.prepper.activateDeal(feId, finishEditLoading);
    this.solve();
  }
  doDealCompareAndSolve() {
    const { getStore } = this;
    const dealDbIds = getStore.get.childrenDbIds("dealMain");

    const menu = this.prepper.oneAndOnly("dealCompareMenu");
    for (const dbId of menu.get.childrenDbIds("comparedDeal")) {
      if (!dealDbIds.includes(dbId)) {
        const compareDeal = menu.childByDbId({
          childName: "comparedDeal",
          dbId,
        });
        compareDeal.removeSelf();
      }
    }

    const compareDbIds = menu.get.childrenDbIds("comparedDeal");
    const cache = this.prepper.oneAndOnly("dealCompareCache");
    for (const system of cache.children("comparedDealSystem")) {
      if (!compareDbIds.includes(system.get.dbId)) {
        system.removeSelf();
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

    const session = this.prepper.oneAndOnly("sessionStore");
    session.updateValues({ compareDealTimeReady: timeS.now() });
    this.solve();
  }
  private addDealSystemToCompareCache(dbId: string) {
    const cache = this.prepper.oneAndOnly("dealCompareCache");
    const feStore = this.prepper.oneAndOnly("feStore");

    const dealSystem = cache.addAndGetChild("comparedDealSystem", { dbId });
    const dealToCompare = dealSystem.onlyChild("deal");

    const deal = feStore.childByDbId({ childName: "dealMain", dbId });
    dealToCompare.loadSelfSectionPack(deal.get.makeSectionPack());
  }
  static initWithDefaultActiveDealAndSolve(): TopOperator {
    const prepper = SolvePrepper.initDefaultAndActiveDeal();
    const to = new TopOperator(prepper.solverProps);
    return to.solve();
  }
  static initWithEmptyMainAndSolve() {
    const main = SolvePrepperSection.initEmptyMain();
    const topOperator = new TopOperator(main.solverProps);
    return topOperator.solve();
  }
}
