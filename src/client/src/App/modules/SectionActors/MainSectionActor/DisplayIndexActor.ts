import { FeStoreNameByType } from "../../../sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/feStoreNameArrs";
import { SetterSection } from "../../../sharedWithServer/StateSetters/SetterSection";
import { SolverSection } from "../../../sharedWithServer/StateSolvers/SolverSection";
import { SectionActorBase } from "../SectionActorBase";

export class DisplayIndexActor extends SectionActorBase<
  FeStoreNameByType<"displayStoreName">
> {
  get list() {
    const list = this.get.onlyChild("displayNameList");
    return new DisplayListActor({
      ...this.sectionActorBaseProps,
      ...list.feInfo,
    });
  }
  get setter() {
    return new SetterSection(this.setterSectionBase.setterSectionProps);
  }
  get solver() {
    return SolverSection.init(this.setterSectionBase.setterSectionProps);
  }
  hasSavedModel(dbId: string): boolean {
    return this.get.hasChildByDbInfo({
      childName: "activeAsSaved",
      dbId,
    });
  }
  removeSavedModel(dbId: string): void {
    this.setter.removeChildByDbId({
      childName: "activeAsSaved",
      dbId,
    });
  }
  removeIfNotSaved(dbId: string) {
    if (!this.list.hasByDbId(dbId)) {
      if (this.hasSavedModel(dbId)) {
        this.removeSavedModel(dbId);
      }
    }
  }
}

export type DisplayItemProps = { dbId: string; displayName: string };
export class DisplayListActor extends SectionActorBase<"displayNameList"> {
  get setter() {
    return new SetterSection(this.setterSectionBase.setterSectionProps);
  }
  get displayItems() {
    return this.get.children("displayNameItem").map((section) => ({
      displayName: section.valueNext("displayName"),
      dbId: section.dbId,
    }));
  }
  hasByDbId(dbId: string) {
    return this.get.hasChildByDbInfo({
      childName: "displayNameItem",
      dbId,
    });
  }
  removeItem(dbId: string) {
    this.setter.removeChildByDbId({
      childName: "displayNameItem",
      dbId,
    });
  }
  addItem({ dbId, displayName }: DisplayItemProps): void {
    this.setter.addChild("displayNameItem", {
      dbId,
      dbVarbs: { displayName },
    });
  }
  updateItem({ dbId, displayName }: DisplayItemProps) {
    const item = this.setter.childByDbId({
      childName: "displayNameItem",
      dbId,
    });
    item.varb("displayName").updateValue(displayName);
  }
}
