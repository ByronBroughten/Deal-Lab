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
import { FeIndexSolver } from "./FeIndexSolver";
import { FeUserSolver } from "./FeUserSolver";

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
  get feIndexSolver(): FeIndexSolver<SN> {
    return new FeIndexSolver(this.solverSectionProps);
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
    return this.feIndexSolver.isSaved(this.dbId);
  }
  get displayItems() {
    return this.feIndexSolver.displayItems;
  }
  loadSectionPack(sectionPack: SectionPack<SN>) {
    this.solver.loadSelfSectionPackAndSolve(sectionPack);
    const siblingDbIds = this.get.siblings.map(({ dbId }) => dbId);
    this.feIndexSolver.integrateLoadedPack(sectionPack, siblingDbIds);
  }
  deleteFromIndex(dbId: string) {
    this.feIndexSolver.deleteFromIndex(dbId);
  }
  deleteSelfFromIndex() {
    this.feIndexSolver.deleteFromIndex(this.dbId);
  }
  saveNew() {
    const sectionPack = this.packMaker.makeSectionPack();
    this.feIndexSolver.addItem(sectionPack);
    const dateTime = timeS.now();
    this.solver.updateValuesAndSolve({
      dateTimeFirstSaved: dateTime,
      dateTimeLastSaved: dateTime,
    } as Partial<SectionValues<SN>>);
  }
  saveUpdates() {
    const sectionPack = this.packMaker.makeSectionPack();
    this.feIndexSolver.updateItem(sectionPack);
    this.solver.updateValuesAndSolve({
      dateTimeLastSaved: timeS.now(),
    } as Partial<SectionValues<SN>>);
  }
  get asSavedPack(): SectionPack<SN> {
    return this.feIndexSolver.getAsSavedPack(this.dbId);
  }
}
