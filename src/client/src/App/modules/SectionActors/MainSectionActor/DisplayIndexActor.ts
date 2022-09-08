import { SetterSection } from "../../../sharedWithServer/StateSetters/SetterSection";
import { SectionActorBase } from "../SectionActorBase";

export type DisplayItemProps = { dbId: string; displayName: string };
export class DisplayIndexActor extends SectionActorBase<"displayNameList"> {
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
