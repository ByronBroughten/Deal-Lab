import { SetterSection } from "../../../sharedWithServer/StateSetters/SetterSection";
import { DisplayItemProps } from "../../SectionSolvers/DisplayListSolver";
import { SectionActorBase } from "../SectionActorBase";

export class DisplayListActor extends SectionActorBase<"displayNameList"> {
  get setter() {
    return new SetterSection(this.setterSectionBase.setterSectionProps);
  }
  get itemDbIds(): string[] {
    return this.displayItems.map(({ dbId }) => dbId);
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
