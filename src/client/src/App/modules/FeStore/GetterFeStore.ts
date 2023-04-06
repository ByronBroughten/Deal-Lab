import {
  StoreName,
  storeNames,
  validateStoreName,
} from "../../sharedWithServer/SectionsMeta/sectionStores";
import { StateValue } from "../../sharedWithServer/SectionsMeta/values/StateValue";
import { GetterSectionBase } from "../../sharedWithServer/StateGetters/Bases/GetterSectionBase";
import { GetterSectionsProps } from "../../sharedWithServer/StateGetters/Bases/GetterSectionsBase";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import {
  initSectionPackArrs,
  SectionPackArrs,
} from "../../sharedWithServer/StatePackers/PackMakerSection";
import { Obj } from "../../sharedWithServer/utils/Obj";

export class GetterFeStore extends GetterSectionBase<"feStore"> {
  constructor(props: GetterSectionsProps) {
    super({
      ...props.sectionsShare.sections.onlyOneRawSection("feStore"),
      sectionsShare: props.sectionsShare,
    });
  }
  get get(): GetterSection<"feStore"> {
    return new GetterSection(this.getterSectionProps);
  }
  get getterSections(): GetterSections {
    return new GetterSections(this.getterSectionsProps);
  }
  get authStatus(): StateValue<"authStatus"> {
    return this.get.valueNext("authStatus");
  }
  get isLoggedIn(): boolean {
    return !this.isGuest;
  }
  get isGuest(): boolean {
    return this.authStatus === "guest";
  }
  saveAttempt(feId: string): GetterSection<"saveAttempt"> {
    return this.get.child({
      childName: "saveAttempt",
      feId,
    });
  }
  get saveAttempts() {
    return this.get.children("saveAttempt");
  }
  get timeOfLastChange(): number {
    return this.get.valueNext("timeOfLastChange");
  }
  get timeOfSave(): number {
    return this.get.valueNext("timeOfSave");
  }
  get saveStatus(): StateValue<"appSaveStatus"> {
    if (this.noneToSaveNorSaving) {
      return "saved";
    } else if (this.allSaving) {
      return "saving";
    } else if (this.get.valueNext("saveFailed")) {
      return "saveFailed";
    } else {
      return "unsaved";
    }
  }
  get nextSaveIsDue() {
    return (
      this.areSomeToSave &&
      this.get.valueNext("timeOfChangeIdle") >
        this.get.valueNext("timeOfLastChange")
    );
  }
  get areSomeToSave(): boolean {
    return !Obj.isEmpty(this.get.valueNext("changesToSave"));
  }
  get noneSaving(): boolean {
    return Obj.isEmpty(this.get.valueNext("changesSaving"));
  }
  get allSaving(): boolean {
    const { get } = this;
    return (
      Obj.isEmpty(get.valueNext("changesToSave")) &&
      !Obj.isEmpty(get.valueNext("changesSaving"))
    );
  }
  get noneToSaveNorSaving(): boolean {
    const { get } = this;
    return (
      Obj.isEmpty(get.valueNext("changesToSave")) &&
      Obj.isEmpty(get.valueNext("changesSaving"))
    );
  }
  toSaveToSaving(): StateValue<"changesSaving"> {
    const changesToSave = this.get.valueNext("changesToSave");
    return Obj.keys(changesToSave).reduce((changesSaving, sectionId) => {
      const change = changesToSave[sectionId];
      switch (change.changeName) {
        case "remove": {
          changesSaving[sectionId] = change;
          break;
        }
        case "update":
        case "add": {
          const sectionPack = this.getterSections
            .sectionBySectionId(sectionId)
            .packMaker.makeSectionPack();
          changesSaving[sectionId] = {
            sectionPack,
            changeName: change.changeName,
          };
        }
      }
      return changesSaving;
    }, {} as StateValue<"changesSaving">);
  }
  get initializedSaveId(): string {
    const save = this.saveAttempts.find(
      (attempt) => attempt.value("attemptStatus") === "initialized"
    );
    if (save) return save.feId;
    else return "";
  }
  get pendingSaveId(): string {
    const save = this.saveAttempts.find(
      (attempt) => attempt.value("attemptStatus") === "pending"
    );
    if (save) return save.feId;
    else return "";
  }
  filterNonSavingToSaves(
    toSave: StateValue<"sectionUpdates">,
    saving: StateValue<"sectionUpdates">
  ): StateValue<"sectionUpdates"> {
    const sectionIds = Obj.keys(toSave);
    return sectionIds.reduce((nonSaving, sectionId) => {
      if (!(sectionId in saving) || toSave[sectionId] > saving[sectionId]) {
        nonSaving[sectionId] = toSave[sectionId];
      }
      return nonSaving;
    }, {} as StateValue<"sectionUpdates">);
  }
  getSaveAttemptPacks(
    saveAttemptId: string
  ): SectionPackArrs<"feStore", StoreName> {
    const saveAttempt = this.get.child({
      childName: "saveAttempt",
      feId: saveAttemptId,
    });
    const updatesAttempting = saveAttempt.valueNext("updatesToSave");
    const sectionIds = Obj.keys(updatesAttempting);

    const sectionPackArrs = initSectionPackArrs("feStore", storeNames);
    for (const sectionId of sectionIds) {
      const section = this.getterSections.sectionBySectionId(sectionId);
      const { selfChildName } = section;

      const storeName = validateStoreName(selfChildName);
      if (!sectionPackArrs[storeName]) {
        sectionPackArrs[storeName] = [];
      }
      sectionPackArrs[storeName].push(
        section.packMaker.makeSectionPack() as any
      );
    }
    return sectionPackArrs;
  }
}
