import { SectionPack } from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/SectionPack";
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
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import { StoreId } from "../../sharedWithServer/StateGetters/StoreId";
import { SolverAdderPrepSection } from "../../sharedWithServer/StateSolvers/SolverAdderPrepSection";
import { SolverSectionBase } from "../../sharedWithServer/StateSolvers/SolverBases/SolverSectionBase";
import { SolverSectionsProps } from "../../sharedWithServer/StateSolvers/SolverBases/SolverSectionsBase";
import { SolverPrepSection } from "../../sharedWithServer/StateSolvers/SolverPrepSection";
import { SolverPrepSections } from "../../sharedWithServer/StateSolvers/SolverPrepSections";
import { SolverSection } from "../../sharedWithServer/StateSolvers/SolverSection";
import { AddChildOptions } from "../../sharedWithServer/StateUpdaters/UpdaterSection";
import { Obj } from "../../sharedWithServer/utils/Obj";
import { timeS } from "../../sharedWithServer/utils/timeS";
import { toastNotice } from "./../../components/appWide/toast";
import { GetterFeStore } from "./GetterFeStore";

export interface AddToStoreProps<CN extends StoreName = StoreName>
  extends StoreNameProp<CN> {
  options?: AddChildOptions<"feStore", CN>;
}

export interface SaveAsToStoreProps<CN extends StoreName = StoreName>
  extends StoreNameProp<CN> {
  sectionPack: SectionPack<StoreSectionName<CN>>;
}

export interface RemoveFromStoreProps extends FeStoreInfo {}

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
  solve() {
    this.solver.solve();
  }
  copyInStore(props: FeStoreInfo) {
    const { storeName, feId } = props;

    this.addToStore({ storeName: storeName });

    const addedSection = this.solver.youngestChild(storeName);

    const toCopy = this.getterFeStore.get.child({
      childName: storeName,
      feId,
    });

    const sectionPack = toCopy.packMaker.makeSectionPack();
    const clone = SolverSection.initFromPackAsOmniChild(sectionPack);
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
    addedSection.basicSolvePrepper.loadSelfSectionPack(clonePack);
    addedSection.updateValuesAndSolve(timeS.makeDateTimeFirstLastSaved());
  }
  saveAndOverwriteToStore({ storeName, sectionPack }: SaveAsToStoreProps) {
    this.addToStore({ storeName }, false);
    const added = this.solver.youngestChild(storeName);
    added.loadSelfAndSolve(sectionPack);
    added.updater.newDbId();
    const addedName = added.value("displayName").mainText;
    for (const child of this.get.children(storeName)) {
      if (child.feId !== added.get.feId) {
        const childName = child.valueNext("displayName").mainText;
        if (childName === addedName) {
          this.removeFromStore({ storeName, feId: child.feId });
        }
      }
    }
  }
  addToStore({ storeName, options }: AddToStoreProps, doSolve: boolean = true) {
    const storedCount = this.get.childCount(storeName);
    if (storedCount >= this.getterFeStore.storageLimit) {
      if (this.getterFeStore.labSubscription === "basicPlan") {
        toastNotice("To add more of those, upgrade to pro.");
      } else {
        toastNotice("You have reached the maximum save limit.");
      }
      throw new Error("Storage limit reached");
    } else {
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
      if (doSolve) this.solve();
    }
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
    child.removeSelfAndSolve();
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
      this.appWideSolvePrepSections.applyVariablesToDealPages();
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
