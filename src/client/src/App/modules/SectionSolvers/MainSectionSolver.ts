import { isEqual } from "lodash";
import { SectionValues } from "../../sharedWithServer/SectionsMeta/baseSectionsDerived/valueMetaTypes";
import { SectionPack } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
import { SectionNameByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import { PackMakerSection } from "../../sharedWithServer/StatePackers.ts/PackMakerSection";
import { SolverSectionBase } from "../../sharedWithServer/StateSolvers/SolverBases/SolverSectionBase";
import { SolverSection } from "../../sharedWithServer/StateSolvers/SolverSection";
import { timeS } from "../../sharedWithServer/utils/date";
import { DisplayIndexSolver } from "./DisplayIndexSolver";
import { FeUserSolver } from "./FeUserSolver";
import { FullIndexSolver } from "./FullIndexSolver";

export type SaveStatus = "unsaved" | "saved" | "unsavedChanges";
export class MainSectionSolver<
  SN extends SectionNameByType<"hasIndexStore">
> extends SolverSectionBase<SN> {
  get solver() {
    return new SolverSection(this.solverSectionProps);
  }
  get get() {
    return new GetterSection(this.getterSectionProps);
  }
  get packMaker() {
    return new PackMakerSection(this.getterSectionProps);
  }
  get getterSections() {
    return new GetterSections(this.solverSectionsProps);
  }
  get hasFullIndex() {
    return this.get.meta.hasFeFullIndex;
  }
  get hasDisplayIndex() {
    return this.get.meta.hasFeDisplayIndex;
  }
  get fullIndexSolver(): FullIndexSolver<any> {
    if (!this.hasFullIndex) {
      throw new Error(`${this.get.sectionName} has no full index store`);
    }
    const { feFullIndexStoreName } = this.get.meta;
    const feUser = this.getterSections.oneAndOnly("feUser");
    return new FullIndexSolver({
      ...this.solverSectionsProps,
      ...feUser.feInfo,
      itemName: feFullIndexStoreName,
    }) as FullIndexSolver<any>;
  }
  get displayIndexSolver() {
    if (!this.hasDisplayIndex) {
      throw new Error(`${this.get.sectionName} has no display index store`);
    }
    const { displayIndexName } = this.get.meta;
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
  get dbId(): string {
    return this.get.dbId;
  }
  get feUserSolver(): FeUserSolver {
    const feUser = this.getterSections.oneAndOnly("feUser");
    return new FeUserSolver({
      ...this.solverSectionsProps,
      ...feUser.feInfo,
    });
  }
  get saveStatus(): SaveStatus {
    if (!this.isSaved) {
      return "unsaved";
    } else {
      let sectionPack = this.packMaker.makeSectionPack();
      let { asSavedPack } = this;
      sectionPack = this.feUserSolver.removeSavedChildren(sectionPack);
      asSavedPack = this.feUserSolver.removeSavedChildren(asSavedPack);
      if (isEqual(sectionPack, asSavedPack)) {
        return "saved";
      } else {
        return "unsavedChanges";
      }
    }
  }
  get isSaved(): boolean {
    return this.primarySolver.hasByDbId(this.get.dbId);
  }
  get displayItems() {
    return this.primarySolver.displayItems;
  }
  loadSectionPack(sectionPack: SectionPack<SN>) {
    this.solver.loadSelfSectionPackAndSolve(sectionPack);
    if (this.hasDisplayIndex) {
      const siblingDbIds = this.get.siblings.map(({ dbId }) => dbId);
      this.displayIndexSolver.removeAsSavedIfNeeded(siblingDbIds);
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

  saveNew() {
    if (this.hasDisplayIndex) {
      this.addDisplayItem();
    }
    if (this.hasFullIndex) {
      this.addFullItem();
    }
    const dateTime = timeS.now();
    this.solver.updateValuesAndSolve({
      dateTimeFirstSaved: dateTime,
      dateTimeLastSaved: dateTime,
    } as Partial<SectionValues<SN>>);
  }
  saveUpdates() {
    if (this.hasDisplayIndex) {
      this.updateDisplayItem();
    }
    if (this.hasFullIndex) {
      this.updateFullItem();
    }
    this.solver.updateValuesAndSolve({
      dateTimeLastSaved: timeS.now(),
    } as Partial<SectionValues<SN>>);
  }
  get asSavedPack(): SectionPack<SN> {
    if (this.hasDisplayIndex) {
      const asSaved = this.displayIndexSolver.getAsSaved(this.get.dbId);
      return asSaved.packMaker.makeSectionPack() as SectionPack<SN>;
    } else {
      return this.fullIndexSolver.getItemPack(this.get.dbId);
    }
  }

  private addFullItem(): void {
    const sectionPack = this.packMaker.makeSectionPack();
    this.fullIndexSolver.addItem(sectionPack as SectionPack<any>);
  }
  private addDisplayItem(): void {
    const sectionPack = this.packMaker.makeSectionPack();
    this.displayIndexSolver.addItem(sectionPack as any);
  }
  private updateFullItem(): void {
    const sectionPack = this.packMaker.makeSectionPack();
    this.fullIndexSolver.updateItem(sectionPack as SectionPack<any>);
  }
  private updateDisplayItem(): void {
    const sectionPack = this.packMaker.makeSectionPack();
    this.displayIndexSolver.updateItem(sectionPack as any);
  }
}
