import isEqual from "fast-deep-equal";
import {
  SectionValues,
  SomeSectionValues,
} from "../../sharedWithServer/SectionsMeta/baseSectionsDerived/valueMetaTypes";
import {
  AutoSyncControl,
  SyncStatus,
} from "../../sharedWithServer/SectionsMeta/relSectionVarbs/relVarbs";
import { SectionPack } from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/SectionPack";
import { SectionNameByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import { PackMakerSection } from "../../sharedWithServer/StatePackers.ts/PackMakerSection";
import { SolverSectionBase } from "../../sharedWithServer/StateSolvers/SolverBases/SolverSectionBase";
import { SolverSection } from "../../sharedWithServer/StateSolvers/SolverSection";
import { UpdaterSection } from "../../sharedWithServer/StateUpdaters/UpdaterSection";
import { timeS } from "../../sharedWithServer/utils/date";
import { FeIndexSolver } from "./FeIndexSolver";
import { FeUserSolver } from "./FeUserSolver";

export type SaveStatus = "unsaved" | "changesSynced" | "unsyncedChanges";
export class MainSectionSolver<
  SN extends SectionNameByType<"hasIndexStore">
> extends SolverSectionBase<SN> {
  get solver() {
    return new SolverSection(this.solverSectionProps);
  }
  get updater() {
    return new UpdaterSection(this.solverSectionProps);
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
  get hasFeDisplayIndex() {
    return this.get.meta.hasFeDisplayIndex;
  }
  get indexSolver(): FeIndexSolver<SN> {
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
      sectionPack = this.feUserSolver.prepForCompare(sectionPack);
      asSavedPack = this.feUserSolver.prepForCompare(asSavedPack);
      if (isEqual(sectionPack, asSavedPack)) {
        return "changesSynced";
      } else {
        return "unsyncedChanges";
      }
    }
  }
  removeSelf() {
    this.solver.removeSelfAndSolve();
  }
  replaceWithDefault() {
    this.solver.replaceWithDefaultAndSolve();
  }
  get isSaved(): boolean {
    return this.indexSolver.isSaved(this.dbId);
  }
  get displayItems() {
    return this.indexSolver.displayItems;
  }
  makeACopy() {
    this.updater.newDbId();
    const titleValue = this.get.valueNext("displayName");
    this.solver.updateValuesAndSolve({
      displayName: {
        ...titleValue,
        mainText: "Copy of " + titleValue.mainText,
      },
    } as SomeSectionValues<SN>);
  }
  copyMinusNameChange() {
    this.updater.newDbId();
  }
  loadSectionPack(sectionPack: SectionPack<SN>) {
    this.solver.loadSelf(sectionPack);
  }

  deleteFromIndex(dbId: string) {
    this.indexSolver.deleteFromIndex(dbId);
  }
  deleteSelfFromIndex() {
    this.indexSolver.deleteFromIndex(this.dbId);

    // the indexSolver should handle the sync stuff with deletes
  }
  saveNew() {
    const dateTime = timeS.now();
    this.solver.updateValuesAndSolve({
      dateTimeFirstSaved: dateTime,
      dateTimeLastSaved: dateTime,
      syncStatus: "changesSynced" as SyncStatus,
      autoSyncControl: "autoSyncOff" as AutoSyncControl,
    } as Partial<SectionValues<SN>>);
    const sectionPack = this.packMaker.makeSectionPack();
    this.indexSolver.addItem(sectionPack);
  }
  saveUpdates() {
    this.solver.updateValuesAndSolve({
      dateTimeLastSaved: timeS.now(),
    } as Partial<SectionValues<SN>>);
    const sectionPack = this.packMaker.makeSectionPack();
    this.indexSolver.updateItem(sectionPack);
  }
  get asSavedPack(): SectionPack<SN> {
    return this.indexSolver.getAsSavedPack(this.dbId);
  }
}
