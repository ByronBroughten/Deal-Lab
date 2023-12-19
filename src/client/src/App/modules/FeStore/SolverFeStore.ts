import { makeDefaultSessionDeal } from "../../../sharedWithServer/defaultMaker/defaultSessionDeal";
import { Id } from "../../../sharedWithServer/Ids/IdS";
import { StoreId } from "../../../sharedWithServer/Ids/StoreId";
import { DbIdProp } from "../../../sharedWithServer/SectionInfo/NanoIdInfo";
import { SectionPack } from "../../../sharedWithServer/SectionPack/SectionPack";
import {
  FeStoreInfo,
  isStoreNameByType,
  StoreName,
  StoreNameProp,
  StoreSectionName,
} from "../../../sharedWithServer/sectionStores";
import { SectionValues } from "../../../sharedWithServer/sectionVarbsConfig/StateValue";
import {
  changeSavingToToSave,
  ChangeToSave,
} from "../../../sharedWithServer/sectionVarbsConfig/StateValue/sectionChanges";
import { ChildSectionName } from "../../../sharedWithServer/sectionVarbsConfigDerived/sectionChildrenDerived/ChildSectionName";
import { AddChildWithPackOptions } from "../../../sharedWithServer/StateClasses/Packers/PackBuilderSection";
import { SolvePrepper } from "../../../sharedWithServer/StateClasses/SolvePreppers/SolvePrepper";
import { SolvePrepperSection } from "../../../sharedWithServer/StateClasses/SolvePreppers/SolvePrepperSection";
import { SolverSectionBase } from "../../../sharedWithServer/StateClasses/SolverBases/SolverSectionBase";
import { SolverSectionsProps } from "../../../sharedWithServer/StateClasses/SolverBases/SolverSectionsBase";
import { SolverSection } from "../../../sharedWithServer/StateClasses/Solvers/SolverSection";
import { SolverSections } from "../../../sharedWithServer/StateClasses/Solvers/SolverSections";
import { GetterSection } from "../../../sharedWithServer/StateGetters/GetterSection";
import { GetterSections } from "../../../sharedWithServer/StateGetters/GetterSections";
import { Obj } from "../../../sharedWithServer/utils/Obj";
import { timeS } from "../../../sharedWithServer/utils/timeS";
import { showDealLimitReachedMessage } from "../../stateClassHooks/useStorageLimitReached";
import { GetterFeStore } from "./GetterFeStore";

export interface AddToStoreProps<CN extends StoreName = StoreName>
  extends StoreNameProp<CN> {
  options?: AddToStoreOptions<CN>;
}

export interface AddToStoreOptions<CN extends StoreName = StoreName>
  extends AddChildWithPackOptions<"feStore", CN> {
  sessionSectionPack?: SectionPack<"sessionSection" | "sessionDeal">;
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
  get solvePrepper(): SolvePrepper {
    return new SolvePrepper(this.solverSectionsProps);
  }

  get prepper(): SolvePrepperSection<"feStore"> {
    return new SolvePrepperSection(this.solverSectionProps);
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
    this.prepper.loadChildren({
      childName: storeName,
      sectionPacks: filteredPacks as SectionPack<any>[],
    });
    this.solve();
  }
  solve() {
    this.solver.solve();
  }
  newestEntry<SN extends StoreName>(
    storeName: SN
  ): SolverSection<StoreSectionName<SN>> {
    const child = this.get.youngestChild(storeName);
    return this.solver.solverSection(child.feInfo) as SolverSection<
      StoreSectionName<SN>
    >;
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
    clone.prepper.updateValues({
      displayName: {
        ...name,
        mainText,
      },
    });

    if (clone.isOfSectionName("deal")) {
      (clone as SolverSection<"deal">).prepper.updateValues({
        displayNameEditor: mainText,
        displayNameSource: "displayNameEditor",
      });
    }

    const clonePack = clone.packMaker.makeSectionPack();

    this.addToStore({
      storeName: storeName,
      options: {
        sectionPack: clonePack,
        ...(storeName === "dealMain" && {
          sessionSectionPack: this.dealSessionPack(toCopy.dbId, clone.get.dbId),
        }),
      },
    });
  }

  private dealSessionPack(
    oldDbId: string,
    newDbId: string
  ): SectionPack<"sessionDeal"> {
    const sessionStore = this.getterSections.oneAndOnly("sessionStore");
    const sessionDeal = sessionStore.childByDbId({
      childName: "dealMain",
      dbId: oldDbId,
    });

    const clone = SolverSection.initFromPackAsOmniChild(
      sessionDeal.makeSectionPack()
    );
    clone.updater.updateDbId(newDbId);
    const displayName = "Copy of " + clone.get.stringValue("displayName");
    clone.prepper.updateValues({ displayName });
    return clone.packMaker.makeSectionPack();
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
  addToStore<CN extends StoreName>(
    { storeName, options }: AddToStoreProps<CN>,
    doSolve: boolean = true
  ) {
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
    const child = this.prepper.addAndGetChild(storeName, {
      ...options,
      sectionValues: {
        ...(options as AddToStoreOptions<any>)?.sectionValues,
        dateTimeFirstSaved: now,
        dateTimeLastSaved: now,
      } as Partial<SectionValues<ChildSectionName<"feStore", CN>>>,
    }) as SolvePrepperSection<any>;
    const storeId = StoreId.make(storeName, child.get.feId);
    this.addChangeToSave(storeId, { changeName: "add" });

    if (storeName === "dealMain") {
      const session = this.solverSections.oneAndOnly("sessionStore");
      session.prepper.addChild("dealMain", {
        sectionPack:
          (options?.sessionSectionPack as SectionPack<"sessionDeal">) ??
          makeDefaultSessionDeal(child.get),
      });
    }

    if (doSolve) this.solve();
  }
  removeFromStore({ storeName, feId }: RemoveFromStoreProps) {
    const child = this.solver.child({ childName: storeName, feId });
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
      proxy.basic.removeSelf();
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
    section.prepper.updateValues({ dateTimeLastSaved: now });
    this.prepper.updateValues({
      changesToSave: toSave,
      timeOfLastChange: now,
    });
  }
  onChangeIdle(): void {
    this.prepper.updateValues({
      timeOfChangeIdle: timeS.now(),
    });

    const { areSomeToSave, noneSaving } = this.getterFeStore;
    if (areSomeToSave && noneSaving) {
      this.initiateSave();
    }
  }
  private initiateSave() {
    this.preSaveAndSolve();
    this.prepper.updateValues({
      timeOfSave: timeS.now(),
      changesSaving: this.getterFeStore.toSaveToSaving(),
      changesToSave: {},
    });
  }
  private doDealUpdate(dbId: string) {
    const deal = this.get.childByDbId({ childName: "dealMain", dbId });

    const cache = this.solverSections.oneAndOnly("dealCompareCache");
    const dealSystems = cache.children("comparedDealSystem");
    for (const system of dealSystems) {
      if (system.get.dbId === dbId) {
        const systemDeal = system.onlyChild("deal");
        systemDeal.prepper.loadSelfSectionPack(deal.makeSectionPack());
      }
    }

    const session = this.solverSections.oneAndOnly("sessionStore");
    const sessionDeal = session.childByDbId({ childName: "dealMain", dbId });
    sessionDeal.loadSelfAndSolve(makeDefaultSessionDeal(deal));
  }
  private preSaveAndSolve() {
    const changesToSave = this.get.valueNext("changesToSave");
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
        const deal = this.get.child({ childName: storeName, feId });
        this.doDealUpdate(deal.dbId);
      }
    }
    if (doVariableUpdate) {
      this.solvePrepper.applyVariablesToDealSystems();
    }
    this.solve();
  }
  finishSave({ success }: { success: boolean }) {
    if (success) {
      this.prepper.updateValues({ changesSaving: {} });
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
    this.prepper.updateValues({
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
    this.prepper.updateValues({ changesToSave: toSave });
  }
}
