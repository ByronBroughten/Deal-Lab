import { constants } from "../../Constants";
import {
  FeStoreInfo,
  StoreName,
  StoreSectionName,
} from "../../sharedWithServer/SectionsMeta/sectionStores";
import { StateValue } from "../../sharedWithServer/SectionsMeta/values/StateValue";
import { GetterSectionBase } from "../../sharedWithServer/StateGetters/Bases/GetterSectionBase";
import { GetterSectionsProps } from "../../sharedWithServer/StateGetters/Bases/GetterSectionsBase";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import { StoreId } from "../../sharedWithServer/StateGetters/StoreId";
import { Obj } from "../../sharedWithServer/utils/Obj";
import { Str } from "../../sharedWithServer/utils/Str";

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
  get isGuest(): boolean {
    return this.authStatus === "guest";
  }
  get isLoggedIn(): boolean {
    return !this.isGuest;
  }
  get labSubscription() {
    return this.get.valueNext("labSubscription");
  }
  get storageLimit() {
    const { labSubscription } = this;
    return constants.plans[labSubscription].sectionSaveLimit;
  }
  get dealCount() {
    return this.get.children("dealMain").length;
  }
  get timeOfLastChange(): number {
    return this.get.valueNext("timeOfLastChange");
  }
  get timeOfSave(): number {
    return this.get.valueNext("timeOfSave");
  }
  displayItems(storeName: StoreName): DisplayItemProps[] {
    return this.get.children(storeName).map((child) => ({
      displayName: child.valueNext("displayName").mainText,
      dbId: child.dbId,
    }));
  }
  alphabeticalDisplayItems(storeName: StoreName) {
    const nameItems = this.displayItems(storeName);
    return nameItems.sort((item1, item2) =>
      Str.compareAlphanumerically(item1.displayName, item2.displayName)
    );
  }
  howManyWithDisplayName(storeName: StoreName, displayName: string) {
    const stored = this.get.children(storeName);
    const withName = stored.filter(
      (child) => child.valueNext("displayName").mainText === displayName
    );
    return withName.length;
  }
  get currentChangesFailedToSave() {
    return this.get.valueNext("timeOfFailedSave") >= this.timeOfLastChange;
  }
  get saveStatus(): StateValue<"appSaveStatus"> {
    if (this.noneToSaveNorSaving) {
      return "saved";
    } else if (this.allSaving) {
      return "saving";
    } else if (this.currentChangesFailedToSave) {
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
  storedSection<CN extends StoreName>({
    storeName,
    feId,
  }: FeStoreInfo<CN>): GetterSection<StoreSectionName<CN>> {
    return this.get.child({ childName: storeName, feId }) as GetterSection<
      StoreSectionName<CN>
    >;
  }
  sectionByStoreId(storeId: string): GetterSection<StoreSectionName> {
    const storeInfo = StoreId.split(storeId);
    return this.storedSection(storeInfo);
  }
  toSaveToSaving(): StateValue<"changesSaving"> {
    const changesToSave = this.get.valueNext("changesToSave");
    return Obj.keys(changesToSave).reduce((changesSaving, storeId) => {
      const change = changesToSave[storeId];
      switch (change.changeName) {
        case "remove": {
          changesSaving[storeId] = change;
          break;
        }
        case "update":
        case "add": {
          const section = this.sectionByStoreId(storeId);
          const sectionPack = section.packMaker.makeSectionPack();
          changesSaving[storeId] = {
            sectionPack,
            changeName: change.changeName,
          };
        }
      }
      return changesSaving;
    }, {} as StateValue<"changesSaving">);
  }
}

export type DisplayItemProps = { dbId: string; displayName: string };
