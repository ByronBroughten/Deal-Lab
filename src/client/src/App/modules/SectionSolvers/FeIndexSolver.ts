import { SectionPack } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
import { SectionNameByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import { SolverListBase } from "../../sharedWithServer/StateSolvers/SolverBases/SolverListBase";
import { DisplayIndexSolver } from "./DisplayIndexSolver";
import { FullIndexSolver } from "./FullIndexSolver";

export class FeIndexSolver<
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
  get fullIndexSolver(): FullIndexSolver<any> {
    if (!this.hasFullIndex) {
      throw new Error(`${this.getL.sectionName} has no full index store`);
    }
    const { feFullIndexStoreName } = this.sectionMeta;
    const feUser = this.getterSections.oneAndOnly("feUser");
    return new FullIndexSolver({
      ...this.solverSectionsProps,
      ...feUser.feInfo,
      itemName: feFullIndexStoreName,
    }) as FullIndexSolver<any>;
  }
  get displayIndexSolver() {
    if (!this.hasDisplayIndex) {
      throw new Error(`${this.getL.sectionName} has no display index store`);
    }
    const { displayIndexName } = this.sectionMeta;
    const feUser = this.getterSections.oneAndOnly("feUser");
    const store = feUser.onlyChild(displayIndexName);
    return new DisplayIndexSolver({
      ...this.solverSectionsProps,
      ...store.feInfo,
    });
  }
  get primarySolver(): DisplayIndexSolver<any> | FullIndexSolver<any> {
    if (this.hasDisplayIndex) {
      return this.displayIndexSolver;
    } else if (this.hasFullIndex) {
      return this.fullIndexSolver;
    } else {
      throw new Error("There is no displayIndex nor fullIndex");
    }
  }
  isSaved(dbId: string): boolean {
    return this.primarySolver.hasByDbId(dbId);
  }
  get displayItems() {
    return this.primarySolver.displayItems;
  }
  integrateLoadedPack(
    sectionPack: SectionPack<SN>,
    loadedSiblingDbIds: string[]
  ) {
    if (this.hasDisplayIndex) {
      this.displayIndexSolver.addAsSavedIfNot(sectionPack as any);
      this.displayIndexSolver.removeAsSavedIfNeeded(loadedSiblingDbIds);
    }
  }
  deleteFromIndex(dbId: string) {
    if (this.hasDisplayIndex) {
      this.displayIndexSolver.removeItem(dbId);
    }
    if (this.hasFullIndex) {
      this.fullIndexSolver.removeItem(dbId);
    }
  }

  addItem(sectionPack: SectionPack<SN>) {
    if (this.hasDisplayIndex) {
      this.displayIndexSolver.addItem(sectionPack as any);
    }
    if (this.hasFullIndex) {
      this.fullIndexSolver.addItem(sectionPack as SectionPack<any>);
    }
  }
  updateItem(sectionPack: SectionPack<SN>) {
    if (this.hasDisplayIndex) {
      this.displayIndexSolver.updateItem(sectionPack as any);
    }
    if (this.hasFullIndex) {
      this.fullIndexSolver.updateItem(sectionPack as SectionPack<any>);
    }
  }
  getAsSavedPack(dbId: string): SectionPack<SN> {
    if (this.hasDisplayIndex) {
      const asSaved = this.displayIndexSolver.getAsSaved(dbId);
      return asSaved.packMaker.makeSectionPack() as SectionPack<SN>;
    } else {
      return this.fullIndexSolver.getItemPack(dbId);
    }
  }
}
