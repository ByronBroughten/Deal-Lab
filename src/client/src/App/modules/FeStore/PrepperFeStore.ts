import {
  FeStoreInfo,
  isStoreNameByType,
  StoreName,
  StoreNameProp,
  StoreSectionName,
} from "../../../sharedWithServer/sectionStores";
import { GetterSection } from "../../../sharedWithServer/StateGetters/GetterSection";
import { GetterSections } from "../../../sharedWithServer/StateGetters/GetterSections";
import { DbIdProp } from "../../../sharedWithServer/StateGetters/Identifiers/NanoIdInfo";
import { StoreId } from "../../../sharedWithServer/StateGetters/Identifiers/StoreId";
import { makeDefaultSessionDeal } from "../../../sharedWithServer/StateOperators/defaultMaker/defaultSessionDeal";
import { AddChildWithPackOptions } from "../../../sharedWithServer/StateOperators/Packers/PackBuilderSection";
import { SolvePrepperSectionBase } from "../../../sharedWithServer/StateOperators/SolvePreppers/Bases/SolvePrepperSectionBase";
import { SolvePrepper } from "../../../sharedWithServer/StateOperators/SolvePreppers/SolvePrepper";
import { SolvePrepperSection } from "../../../sharedWithServer/StateOperators/SolvePreppers/SolvePrepperSection";
import { SolverSectionsProps } from "../../../sharedWithServer/StateOperators/SolverBases/SolverSectionsBase";
import { ChildSectionName } from "../../../sharedWithServer/stateSchemas/derivedFromChildrenSchemas/ChildSectionName";
import { SectionValues } from "../../../sharedWithServer/stateSchemas/StateValue";
import {
  changeSavingToToSave,
  ChangeToSave,
} from "../../../sharedWithServer/stateSchemas/StateValue/sectionChanges";
import { SectionPack } from "../../../sharedWithServer/StateTransports/SectionPack";
import { IdS } from "../../../sharedWithServer/utils/IdS";
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

export class PrepperFeStore extends SolvePrepperSectionBase<"feStore"> {
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
  get prepper(): SolvePrepperSection<"feStore"> {
    return new SolvePrepperSection(this.prepperSectionProps);
  }
  get solvePrepper(): SolvePrepper {
    return new SolvePrepper(this.solverProps);
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
  }
  newestEntry<SN extends StoreName>(
    storeName: SN
  ): SolvePrepperSection<StoreSectionName<SN>> {
    const child = this.get.youngestChild(storeName);
    return this.solvePrepper.prepperSection(
      child.feInfo
    ) as SolvePrepperSection<StoreSectionName<SN>>;
  }
  copyInStore(props: FeStoreInfo) {
    const { storeName, feId } = props;

    const toCopy = this.getterFeStore.get.child({
      childName: storeName,
      feId,
    });

    const originalPack = toCopy.packMaker.makeSectionPack();

    // ok, basically what happened is, the sections are being added, but
    // their entities aren't being updated

    const clone = SolvePrepperSection.initFromPackAsOmniChild(originalPack);
    clone.updater.newDbId();
    const name = clone.get.valueNext("displayName");
    const mainText = "Copy of " + name.mainText;
    clone.updateValues({
      displayName: {
        ...name,
        mainText,
      },
    });

    if (clone.isOfSectionName("deal")) {
      clone.updateValues({
        displayNameEditor: mainText,
        displayNameSource: "displayNameEditor",
      });
    }

    const clonePack = clone.get.makeSectionPack();

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

    const clone = SolvePrepperSection.initFromPackAsOmniChild(
      sessionDeal.makeSectionPack()
    );
    clone.updater.updateDbId(newDbId);
    const displayName = "Copy of " + clone.get.stringValue("displayName");
    clone.updateValues({ displayName });
    return clone.get.makeSectionPack();
  }

  saveAndOverwriteToStore({ storeName, sectionPack }: SaveAsToStoreProps) {
    this.addToStore({ storeName, options: { dbId: IdS.make(), sectionPack } });
    const added = this.prepper.youngestChild(storeName);
    const addedName = added.get.valueNext("displayName").mainText;
    for (const child of this.get.children(storeName)) {
      if (child.feId !== added.get.feId) {
        const childDName = child.valueNext("displayName").mainText;
        if (childDName === addedName) {
          this.removeFromStore({ storeName, feId: child.feId });
        }
      }
    }
  }
  addToStore<CN extends StoreName>({
    storeName,
    options,
  }: AddToStoreProps<CN>) {
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
      const session = this.solvePrepper.oneAndOnly("sessionStore");
      session.addChild("dealMain", {
        sectionPack:
          (options?.sessionSectionPack as SectionPack<"sessionDeal">) ??
          makeDefaultSessionDeal(child.get),
      });
    }
  }
  removeFromStore({ storeName, feId }: RemoveFromStoreProps) {
    const child = this.prepper.child({ childName: storeName, feId });
    const storeId = StoreId.make(storeName, feId);
    this.addChangeToSave(storeId, {
      changeName: "remove",
      dbId: child.get.dbId,
    });

    if (storeName === "dealMain") {
      const session = this.solvePrepper.oneAndOnly("sessionStore");
      const proxy = session.childByDbId({
        childName: "dealMain",
        dbId: child.get.dbId,
      });
      proxy.removeSelf();
    }
    child.removeSelf();
  }
  removeFromStoreByDbId({ storeName, dbId }: RemoveFromStoreByDbIdProps) {
    const { feId } = this.get.childByDbId({
      childName: storeName,
      dbId,
    });
    this.removeFromStore({ storeName, feId });
  }
  sectionByStoreId(storeId: string): SolvePrepperSection<StoreSectionName> {
    const { feInfo } = this.getterFeStore.sectionByStoreId(storeId);
    return this.solvePrepper.prepperSection(feInfo);
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
        break;
      }
    }

    const now = timeS.now();
    const section = this.sectionByStoreId(storeId);
    section.updateValues({ dateTimeLastSaved: now });
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

    const cache = this.solvePrepper.oneAndOnly("dealCompareCache");
    const dealSystems = cache.children("comparedDealSystem");
    for (const system of dealSystems) {
      if (system.get.dbId === dbId) {
        const systemDeal = system.onlyChild("deal");
        systemDeal.loadSelfSectionPack(deal.makeSectionPack());
      }
    }

    const session = this.solvePrepper.oneAndOnly("sessionStore");
    const sessionDeal = session.childByDbId({ childName: "dealMain", dbId });
    sessionDeal.loadSelfSectionPack(makeDefaultSessionDeal(deal));
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
