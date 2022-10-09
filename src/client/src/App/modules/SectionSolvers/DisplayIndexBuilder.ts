import { ChildSectionPack } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/ChildSectionPack";
import { FeStoreNameByType } from "../../sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/FeStoreName";
import { SectionPackByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { PackBuilderSection } from "../../sharedWithServer/StatePackers.ts/PackBuilderSection";
import { SolverSectionBase } from "../../sharedWithServer/StateSolvers/SolverBases/SolverSectionBase";
import { DisplayListSolver } from "./DisplayListBuilder";

export class DisplayIndexBuilder<
  SN extends FeStoreNameByType<"displayIndex">
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
  removeAsSavedExtras(loadedDbIds: string[]) {
    for (const dbId of loadedDbIds) {
      this.removeAsSavedIfExtra(dbId);
    }
  }
  addItem(sectionPack: ChildSectionPack<SN, "activeAsSaved">) {
    const child = PackBuilderSection.loadAsOmniChild(
      sectionPack as any as SectionPackByType<"hasFeDisplayIndex">
    );
    this.list.addItem({
      displayName: child.get.valueNext("displayName").mainText,
      dbId: child.get.dbId,
    });
    this.addAsSavedIfMissing(sectionPack);
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
    this.removeAsSavedIfExtra(dbId);
  }
  addAsSavedIfMissing(
    sectionPack: ChildSectionPack<SN, "activeAsSaved">
  ): void {
    const { dbId } = sectionPack;
    if (this.list.hasByDbId(dbId)) {
      if (!this.hasAsSaved(dbId)) {
        this.builder.loadChild({
          childName: "activeAsSaved",
          sectionPack: sectionPack as any,
        });
      }
    }
  }
  hasAsSaved(dbId: string): boolean {
    return this.get.hasChildByDbInfo({
      childName: "activeAsSaved",
      dbId,
    });
  }
  private removeAsSavedIfExtra(dbId: string) {
    if (!this.list.hasByDbId(dbId)) {
      if (this.hasAsSaved(dbId)) {
        this.removeAsSaved(dbId);
      }
    }
  }
  private removeAsSaved(dbId: string): void {
    this.builder.removeChildByDbId({
      childName: "activeAsSaved",
      dbId,
    });
  }
}
