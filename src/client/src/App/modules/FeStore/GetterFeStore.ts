import {
  StoreName,
  storeNames,
  validateStoreName,
} from "../../sharedWithServer/SectionsMeta/sectionStores";
import { StateValue } from "../../sharedWithServer/SectionsMeta/values/StateValue";
import { inProcessStatus } from "../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
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
  get saveAttempts() {
    return this.get.children("saveAttempt");
  }
  get saveStatus(): StateValue<"appSaveStatus"> {
    const { get } = this;
    const toSave = get.valueNext("toSaveUpdates");
    if (Obj.keys(toSave).length === 0) {
      return "saved";
    }
    const saving = this.initializedOrPendingUpdates;
    if (Obj.shallowEqual(toSave, saving)) {
      return "saving";
    } else {
      const { saveAttempts } = this;
      if (
        saveAttempts.some(
          (attempt) => attempt.value("attemptStatus") === "failed"
        )
      ) {
        return "saveFailed";
      } else {
        return "unsaved";
      }
    }
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
  get sectionsToSaveHex(): string {
    const toSaveUpdates = this.get.valueNext("toSaveUpdates");
    if (Obj.keys(toSaveUpdates).length > 0) {
      return JSON.stringify(toSaveUpdates);
    } else return "";
  }
  get failedSavesString(): string {
    let failedSaves = "";
    this.saveAttempts.forEach((attempt) => {
      if (attempt.value("attemptStatus") === "failed") {
        failedSaves += attempt.feId;
      }
    });
    return failedSaves;
  }
  getSaveAttemptPacks(
    saveAttemptId: string
  ): SectionPackArrs<"feStore", StoreName> {
    const saveAttempt = this.get.child({
      childName: "saveAttempt",
      feId: saveAttemptId,
    });
    const updatesAttempting = saveAttempt.valueNext("sectionUpdates");
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
  get initializedOrPendingUpdates() {
    return this.saveAttempts.reduce(
      (updates, activeSave) => ({
        ...updates,
        ...(inProcessStatus.includes(activeSave.value("attemptStatus") as any)
          ? activeSave.valueNext("sectionUpdates")
          : {}),
      }),
      {} as StateValue<"sectionUpdates">
    );
  }
}
