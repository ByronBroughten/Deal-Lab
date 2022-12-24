import { SectionPack } from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/SectionPack";
import { SectionNameByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import { SolverListBase } from "../../sharedWithServer/StateSolvers/SolverBases/SolverListBase";
import { FullIndexSolver } from "./FullIndexSolver";

export class FeIndexSolver<
  SN extends SectionNameByType<"hasIndexStore">
> extends SolverListBase<SN> {
  get hasFullIndex() {
    return this.sectionMeta.hasFeFullIndex;
  }
  get hasFeDisplayIndex() {
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
  isSaved(dbId: string): boolean {
    return this.fullIndexSolver.hasByDbId(dbId);
  }
  get displayItems() {
    return this.fullIndexSolver.displayItems;
  }
  deleteFromIndex(dbId: string): void {
    this.fullIndexSolver.removeItem(dbId);
  }
  addItem(sectionPack: SectionPack<SN>): void {
    this.fullIndexSolver.addItem(sectionPack as SectionPack<any>);
  }
  updateItem(sectionPack: SectionPack<SN>): void {
    this.fullIndexSolver.updateItem(sectionPack as SectionPack<any>);
  }
  getItem(dbId: string): SectionPack<SN> {
    return this.fullIndexSolver.getItem(dbId).makeSectionPack();
  }
  getAsSavedPack(dbId: string): SectionPack<SN> {
    return this.fullIndexSolver.getItemPack(dbId);
  }
}
