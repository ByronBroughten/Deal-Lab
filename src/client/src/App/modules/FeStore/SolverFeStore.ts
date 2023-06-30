import { UserData } from "../../sharedWithServer/apiQueriesShared/validateUserData";
import { Id } from "../../sharedWithServer/SectionsMeta/IdS";
import { SectionPack } from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/SectionPack";
import { DbIdProp } from "../../sharedWithServer/SectionsMeta/SectionInfo/NanoIdInfo";
import {
  FeStoreInfo,
  isStoreNameByType,
  StoreName,
  StoreNameProp,
  StoreSectionName,
} from "../../sharedWithServer/SectionsMeta/sectionStores";
import {
  changeSavingToToSave,
  ChangeToSave,
} from "../../sharedWithServer/SectionsMeta/values/StateValue/sectionChanges";
import { showDealLimitReachedMessage } from "../../sharedWithServer/stateClassHooks/useStorageLimitReached";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import { StoreId } from "../../sharedWithServer/StateGetters/StoreId";
import { AddChildWithPackOptions } from "../../sharedWithServer/StatePackers/PackBuilderSection";
import { SolverAdderPrepSection } from "../../sharedWithServer/StateSolvers/SolverAdderPrepSection";
import { SolverSectionBase } from "../../sharedWithServer/StateSolvers/SolverBases/SolverSectionBase";
import { SolverSectionsProps } from "../../sharedWithServer/StateSolvers/SolverBases/SolverSectionsBase";
import { SolverPrepSection } from "../../sharedWithServer/StateSolvers/SolverPrepSection";
import { SolverPrepSections } from "../../sharedWithServer/StateSolvers/SolverPrepSections";
import { SolverSection } from "../../sharedWithServer/StateSolvers/SolverSection";
import { SolverSections } from "../../sharedWithServer/StateSolvers/SolverSections";
import { Obj } from "../../sharedWithServer/utils/Obj";
import { timeS } from "../../sharedWithServer/utils/timeS";
import { GetterFeStore } from "./GetterFeStore";

export interface AddToStoreProps<CN extends StoreName = StoreName>
  extends StoreNameProp<CN> {
  options?: AddChildWithPackOptions<"feStore", CN>;
}

export interface SaveAsToStoreProps<CN extends StoreName = StoreName>
  extends StoreNameProp<CN> {
  sectionPack: SectionPack<StoreSectionName<CN>>;
}

export interface RemoveFromStoreProps extends FeStoreInfo {}
export interface RemoveFromStoreByDbIdProps extends DbIdProp, StoreNameProp {}

export class SolverFeStore extends SolverSectionBase<"feStore"> {
  constructor(props: SolverSectionsProps) {
    super({
      ...props.sectionsShare.sections.onlyOneRawSection("feStore"),
      ...props,
    });
  }

  get getterFeStore(): GetterFeStore {
    return new GetterFeStore(this.getterSectionsBase.getterSectionsProps);
  }
  get get(): GetterSection<"feStore"> {
    return new GetterSection(this.getterSectionProps);
  }
  get getterSections(): GetterSections {
    return new GetterSections(this.getterSectionProps);
  }
  get solverSections(): SolverSections {
    return new SolverSections(this.solverSectionsProps);
  }
  get solver(): SolverSection<"feStore"> {
    return new SolverSection(this.solverSectionProps);
  }
  get appWideSolvePrepSections(): SolverPrepSections {
    return new SolverPrepSections(this.solverSectionsProps);
  }
  get appWideSolvePrepper(): SolverPrepSection<"feStore"> {
    return new SolverPrepSection(this.solverSectionProps);
  }
  get basicSolvePrepper(): SolverAdderPrepSection<"feStore"> {
    return new SolverAdderPrepSection(this.solverSectionProps);
  }
  loadChildrenNoDuplicates<SN extends StoreName>(
    storeName: SN,
    allPacks: SectionPack<StoreSectionName<SN>>[]
  ) {
    const filteredPacks = allPacks.filter(
      (pack) =>
        !this.get.hasChildByDbInfo({
          childName: storeName,
          dbId: pack.dbId,
        })
    );

    this.basicSolvePrepper.loadChildren({
      childName: storeName,
      sectionPacks: filteredPacks as SectionPack<any>[],
    });
    this.appWideSolvePrepper.addAppWideMissingOutEntities();
    this.solve();
  }
  solve() {
    this.solver.solve();
  }
  loadUserData(userData: UserData) {
    this.appWideSolvePrepSections.deactivateDealAndDealSystem();

    const sessionStore = this.solverSections.oneAndOnly("sessionStore");
    sessionStore.basicSolvePrepper.loadSelfSectionPack(userData.sessionStore);

    this.solver.loadSelfAndSolve(userData.feStore);

    const compareMenu = this.solver.get.onlyChild("dealCompareMenu");
    for (const comparedDeal of compareMenu.children("comparedDeal")) {
      this.solverSections.addDealSystemToCompare(comparedDeal.dbId);
    }
    this.basicSolvePrepper.updateValues({ userDataFetchTryCount: 0 });
  }
  newestEntry<SN extends StoreName>(
    storeName: SN
  ): SolverSection<StoreSectionName<SN>> {
    const child = this.get.youngestChild(storeName);
    return this.solver.solverSection(child.feInfo) as SolverSection<
      StoreSectionName<SN>
    >;
  }
  incrementGetUserDataTry() {
    const count = this.get.valueNext("userDataFetchTryCount");
    this.basicSolvePrepper.updateValues({
      userDataFetchTryCount: count + 1,
    });
  }
  copyInStore(props: FeStoreInfo) {
    const { storeName, feId } = props;

    const toCopy = this.getterFeStore.get.child({
      childName: storeName,
      feId,
    });

    const originalPack = toCopy.packMaker.makeSectionPack();

    const clone = SolverSection.initFromPackAsOmniChild(originalPack);
    clone.updater.newDbId();
    const name = clone.get.valueNext("displayName");
    const mainText = "Copy of " + name.mainText;
    clone.basicSolvePrepper.updateValues({
      displayName: {
        ...name,
        mainText,
      },
    });

    if (clone.isOfSectionName("deal")) {
      (clone as SolverSection<"deal">).basicSolvePrepper.updateValues({
        displayNameEditor: mainText,
        displayNameSource: "displayNameEditor",
      });
    }

    const clonePack = clone.packMaker.makeSectionPack();
    this.addToStore({
      storeName: storeName,
      options: { sectionPack: clonePack },
    });
  }
  saveAndOverwriteToStore({ storeName, sectionPack }: SaveAsToStoreProps) {
    this.addToStore(
      { storeName, options: { dbId: Id.make(), sectionPack } },
      false
    );
    const added = this.solver.youngestChild(storeName);
    const addedName = added.value("displayName").mainText;
    for (const child of this.get.children(storeName)) {
      if (child.feId !== added.get.feId) {
        const childDName = child.valueNext("displayName").mainText;
        if (childDName === addedName) {
          this.removeFromStore({ storeName, feId: child.feId });
        }
      }
    }
  }
  addToStore({ storeName, options }: AddToStoreProps, doSolve: boolean = true) {
    if (
      storeName === "dealMain" &&
      this.getterFeStore.labSubscription === "basicPlan"
    ) {
      const session = this.getterSections.oneAndOnly("sessionStore");
      const storedCount = session.childCount("dealMain");
      if (storedCount >= this.getterFeStore.storageLimit) {
        return showDealLimitReachedMessage();
      }
    }

    const now = timeS.now();
    const child = this.appWideSolvePrepper.addAndGetChild(storeName, {
      ...options,
      sectionValues: {
        ...options?.sectionValues,
        dateTimeFirstSaved: now,
        dateTimeLastSaved: now,
      },
    });
    const storeId = StoreId.make(storeName, child.get.feId);
    this.addChangeToSave(storeId, { changeName: "add" });

    if (storeName === "dealMain") {
      const session = this.solverSections.oneAndOnly("sessionStore");
      session.appWideSolvePrepper.addChild("dealMain", {
        dbId: child.get.dbId,
        sectionValues: { dateTimeCreated: now },
      });
    }

    if (doSolve) this.solve();
  }
  removeFromStore({ storeName, feId }: RemoveFromStoreProps) {
    const child = this.solver.child({
      childName: storeName,
      feId,
    });
    const storeId = StoreId.make(storeName, feId);
    this.addChangeToSave(storeId, {
      changeName: "remove",
      dbId: child.get.dbId,
    });

    if (storeName === "dealMain") {
      const session = this.solverSections.oneAndOnly("sessionStore");
      const proxy = session.childByDbId({
        childName: "dealMain",
        dbId: child.get.dbId,
      });
      proxy.removeSelfAndSolve();
    }

    child.removeSelfAndSolve();
  }
  removeFromStoreByDbId({ storeName, dbId }: RemoveFromStoreByDbIdProps) {
    const { feId } = this.get.childByDbId({
      childName: storeName,
      dbId,
    });
    this.removeFromStore({ storeName, feId });
  }
  sectionByStoreId(storeId: string): SolverSection<StoreSectionName> {
    const { feInfo } = this.getterFeStore.sectionByStoreId(storeId);
    return this.solver.solverSection(feInfo);
  }
  addChangeToSave(storeId: string, change: ChangeToSave) {
    const toSave = { ...this.get.valueNext("changesToSave") };
    switch (change.changeName) {
      case "add":
      case "remove": {
        toSave[storeId] = change;
        break;
      }
      case "update": {
        if (!toSave[storeId]) {
          toSave[storeId] = change;
        }
      }
    }

    const now = timeS.now();
    const section = this.sectionByStoreId(storeId);
    section.basicSolvePrepper.updateValues({ dateTimeLastSaved: now });
    this.basicSolvePrepper.updateValues({
      changesToSave: toSave,
      timeOfLastChange: now,
    });
  }
  onChangeIdle(): void {
    this.basicSolvePrepper.updateValues({
      timeOfChangeIdle: timeS.now(),
    });

    const { areSomeToSave, noneSaving } = this.getterFeStore;
    if (areSomeToSave && noneSaving) {
      this.initiateSave();
    }
  }
  private initiateSave() {
    this.preSaveAndSolve();
    this.basicSolvePrepper.updateValues({
      timeOfSave: timeS.now(),
      changesSaving: this.getterFeStore.toSaveToSaving(),
      changesToSave: {},
    });
  }
  private preSaveAndSolve() {
    const storeIds = Obj.keys(this.get.valueNext("changesToSave"));
    let doVariableUpdate = false;
    for (const storeId of storeIds) {
      const { storeName } = StoreId.split(storeId);
      if (isStoreNameByType(storeName, "variableStore")) {
        doVariableUpdate = true;
        break;
      }
    }
    if (doVariableUpdate) {
      this.appWideSolvePrepSections.applyVariablesToDealSystems();
    }
  }
  finishSave({ success }: { success: boolean }) {
    if (success) {
      this.basicSolvePrepper.updateValues({ changesSaving: {} });
      if (this.getterFeStore.nextSaveIsDue) {
        this.initiateSave();
      }
    } else {
      this.handleFailedSave();
    }
  }
  private handleFailedSave() {
    const failedChanges = this.get.valueNext("changesSaving");
    for (const storeId of Obj.keys(failedChanges)) {
      const failedChange = changeSavingToToSave(failedChanges[storeId]);
      this.reIntegrateFailedChanges(storeId, failedChange);
    }
    this.basicSolvePrepper.updateValues({
      changesSaving: {},
      timeOfFailedSave: timeS.now(),
    });
  }
  private reIntegrateFailedChanges(
    storeId: string,
    failedChange: ChangeToSave
  ) {
    const toSave = { ...this.get.valueNext("changesToSave") };
    const currentChange = toSave[storeId];
    if (!currentChange) {
      toSave[storeId] = failedChange;
    } else {
      switch (currentChange.changeName) {
        case "add": {
          throw new Error(
            "An add was attempted after other changes, presumably after another add."
          );
        }
        case "update": {
          toSave[storeId] = failedChange;
          break;
        }
        case "remove": {
          switch (failedChange.changeName) {
            case "add": {
              delete toSave[storeId];
              break;
            }
            case "remove": {
              throw new Error("A remove was attempted after another remove.");
            }
          }
        }
      }
    }
    this.basicSolvePrepper.updateValues({ changesToSave: toSave });
  }
}
