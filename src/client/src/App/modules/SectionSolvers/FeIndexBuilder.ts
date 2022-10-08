import { SectionPack } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
import { SectionNameByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import { SolverListBase } from "../../sharedWithServer/StateSolvers/SolverBases/SolverListBase";
import { DisplayIndexBuilder } from "./DisplayIndexBuilder";
import { FullIndexBuilder } from "./FullIndexBuilder";

export class FeIndexBuilder<
  SN extends SectionNameByType<"hasIndexStore">
> extends SolverListBase<SN> {
  get hasFullIndex() {
    return this.sectionMeta.hasFeFullIndex;
  }
  get hasDisplayIndex() {
    return this.sectionMeta.hasFeDisplayIndex;
  }
  get getterSections() {
    return new GetterSections(this.getterListProps);
  }
  get fullIndexBuilder(): FullIndexBuilder<any> {
    if (!this.hasFullIndex) {
      throw new Error(`${this.getL.sectionName} has no full index store`);
    }
    const { feFullIndexStoreName } = this.sectionMeta;
    const feUser = this.getterSections.oneAndOnly("feUser");
    return new FullIndexBuilder({
      ...this.solverSectionsProps,
      ...feUser.feInfo,
      itemName: feFullIndexStoreName,
    }) as FullIndexBuilder<any>;
  }
  get displayIndexBuilder() {
    if (!this.hasDisplayIndex) {
      throw new Error(`${this.getL.sectionName} has no display index store`);
    }
    const { displayIndexName } = this.sectionMeta;
    const feUser = this.getterSections.oneAndOnly("feUser");
    const store = feUser.onlyChild(displayIndexName);
    return new DisplayIndexBuilder({
      ...this.solverSectionsProps,
      ...store.feInfo,
    });
  }
  get primaryIndex(): DisplayIndexBuilder<any> | FullIndexBuilder<any> {
    if (this.hasDisplayIndex) {
      return this.displayIndexBuilder;
    } else if (this.hasFullIndex) {
      return this.fullIndexBuilder;
    } else {
      throw new Error("There is no displayIndex nor fullIndex");
    }
  }
  isSaved(dbId: string): boolean {
    return this.primaryIndex.hasByDbId(dbId);
  }
  get displayItems() {
    return this.primaryIndex.displayItems;
  }
  addAsSavedIfMissing(sectionPack: SectionPack<SN>) {
    if (this.hasDisplayIndex) {
      this.displayIndexBuilder.addAsSavedIfNot(sectionPack as any);
    }
  }
  removeExtraAsSaved(loadedDbIds: string[]) {
    if (this.hasDisplayIndex) {
      this.displayIndexBuilder.removeExtraAsSaved(loadedDbIds);
    }
  }
  deleteFromIndex(dbId: string) {
    if (this.hasDisplayIndex) {
      this.displayIndexBuilder.removeItem(dbId);
    }
    if (this.hasFullIndex) {
      this.fullIndexBuilder.removeItem(dbId);
    }
  }

  addItem(sectionPack: SectionPack<SN>): void {
    if (this.hasDisplayIndex) {
      this.displayIndexBuilder.addItem(sectionPack as any);
    }
    if (this.hasFullIndex) {
      this.fullIndexBuilder.addItem(sectionPack as SectionPack<any>);
    }
  }
  updateItem(sectionPack: SectionPack<SN>) {
    if (this.hasDisplayIndex) {
      this.displayIndexBuilder.updateItem(sectionPack as any);
    }
    if (this.hasFullIndex) {
      this.fullIndexBuilder.updateItem(sectionPack as SectionPack<any>);
    }
  }
  getAsSavedPack(dbId: string): SectionPack<SN> {
    if (this.hasDisplayIndex) {
      const asSaved = this.displayIndexBuilder.getAsSaved(dbId);
      return asSaved.makeSectionPack() as SectionPack<SN>;
    } else {
      return this.fullIndexBuilder.getItemPack(dbId);
    }
  }
}
