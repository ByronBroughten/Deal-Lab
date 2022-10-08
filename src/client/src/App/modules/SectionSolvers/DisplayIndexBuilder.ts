import { ChildSectionPack } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/ChildSectionPack";
import { FeStoreNameByType } from "../../sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/FeStoreName";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { PackBuilderSection } from "../../sharedWithServer/StatePackers.ts/PackBuilderSection";
import { SolverSectionBase } from "../../sharedWithServer/StateSolvers/SolverBases/SolverSectionBase";
import { DisplayListSolver } from "./DisplayListBuilder";

export class DisplayIndexBuilder<
  SN extends FeStoreNameByType<"displayStoreName">
> extends SolverSectionBase<SN> {
  get get() {
    return new GetterSection(this.solverSectionProps);
  }
  get builder() {
    return new PackBuilderSection(this.getterSectionProps);
  }
  get list() {
    const list = this.get.onlyChild("displayNameList");
    return new DisplayListSolver({
      ...this.solverSectionsProps,
      ...list.feInfo,
    });
  }
  get displayItems() {
    return this.list.displayItems;
  }
  hasByDbId(dbId: string) {
    return this.list.hasByDbId(dbId);
  }
  private displayNameString(dbId: string): string {
    return this.getAsSaved(dbId).get.valueNext("displayName").mainText;
  }
  getAsSaved(dbId: string) {
    return this.builder.childByDbId({
      childName: "activeAsSaved",
      dbId,
    });
  }
  removeExtraAsSaved(loadedDbIds: string[]) {
    const { itemDbIds } = this.list;
    const asSavedList = this.get.children("activeAsSaved");
    for (const { dbId } of asSavedList) {
      if (loadedDbIds.includes(dbId) && itemDbIds.includes(dbId)) {
        continue;
      } else {
        this.removeAsSaved(dbId);
      }
    }
  }
  addItem(sectionPack: ChildSectionPack<SN, "activeAsSaved">) {
    this.addAsSavedIfNot(sectionPack);
    const { dbId } = sectionPack;
    const child = this.getAsSaved(dbId).get;
    this.list.addItem({
      displayName: child.valueNext("displayName").mainText,
      dbId,
    });
  }
  updateItem(sectionPack: ChildSectionPack<SN, "activeAsSaved">) {
    const { dbId } = sectionPack;
    const child = this.builder.childByDbId({
      childName: "activeAsSaved",
      dbId,
    });
    child.loadSelf(sectionPack);
    this.list.updateItem({
      displayName: this.displayNameString(dbId),
      dbId,
    });
  }
  removeItem(dbId: string) {
    this.list.removeItem(dbId);
    this.removeAsSavedlIfNot(dbId);
  }
  addAsSavedIfNot(sectionPack: ChildSectionPack<SN, "activeAsSaved">): void {
    const { dbId } = sectionPack;
    if (!this.hasAsSaved(dbId)) {
      this.builder.loadChild({
        childName: "activeAsSaved",
        sectionPack: sectionPack as any,
      });
    }
  }
  private removeAsSavedlIfNot(dbId: string) {
    if (!this.list.hasByDbId(dbId)) {
      if (this.hasAsSaved(dbId)) {
        this.removeAsSaved(dbId);
      }
    }
  }
  hasAsSaved(dbId: string): boolean {
    return this.get.hasChildByDbInfo({
      childName: "activeAsSaved",
      dbId,
    });
  }
  private removeAsSaved(dbId: string): void {
    this.builder.removeChildByDbId({
      childName: "activeAsSaved",
      dbId,
    });
  }
}
