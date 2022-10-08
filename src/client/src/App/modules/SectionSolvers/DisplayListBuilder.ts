import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { PackBuilderSection } from "../../sharedWithServer/StatePackers.ts/PackBuilderSection";
import { SolverSectionBase } from "../../sharedWithServer/StateSolvers/SolverBases/SolverSectionBase";

export type DisplayItemProps = { dbId: string; displayName: string };
export class DisplayListSolver extends SolverSectionBase<"displayNameList"> {
  get builder(): PackBuilderSection<"displayNameList"> {
    return new PackBuilderSection(this.getterSectionProps);
  }
  get get(): GetterSection<"displayNameList"> {
    return new GetterSection(this.getterSectionProps);
  }
  get itemDbIds(): string[] {
    return this.displayItems.map(({ dbId }) => dbId);
  }
  get displayItems(): DisplayItemProps[] {
    return this.get.children("displayNameItem").map((section) => ({
      displayName: section.valueNext("displayName"),
      dbId: section.dbId,
    }));
  }
  hasByDbId(dbId: string): boolean {
    return this.get.hasChildByDbInfo({
      childName: "displayNameItem",
      dbId,
    });
  }
  removeItem(dbId: string): void {
    this.builder.removeChildByDbId({
      childName: "displayNameItem",
      dbId,
    });
  }
  addItem({ dbId, displayName }: DisplayItemProps): void {
    this.builder.addChild("displayNameItem", {
      dbId,
      dbVarbs: { displayName },
    });
  }
  updateItem({ dbId, displayName }: DisplayItemProps) {
    const item = this.builder.childByDbId({
      childName: "displayNameItem",
      dbId,
    });
    item.updater.varb("displayName").updateValue(displayName);
  }
}
