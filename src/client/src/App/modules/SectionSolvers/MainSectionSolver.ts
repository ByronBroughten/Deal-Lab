import isEqual from "fast-deep-equal";
import { SectionPack } from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/SectionPack";
import { SectionNameByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import {
  SectionValues,
  SomeSectionValues,
} from "../../sharedWithServer/SectionsMeta/values/StateValue";
import { StringObj } from "../../sharedWithServer/SectionsMeta/values/StateValue/StringObj";
import {
  AutoSyncControl,
  SyncStatus,
} from "../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import { PackMakerSection } from "../../sharedWithServer/StatePackers.ts/PackMakerSection";
import { SolverSectionBase } from "../../sharedWithServer/StateSolvers/SolverBases/SolverSectionBase";
import { SolverSection } from "../../sharedWithServer/StateSolvers/SolverSection";
import { UpdaterSection } from "../../sharedWithServer/StateUpdaters/UpdaterSection";
import { timeS } from "../../sharedWithServer/utils/date";
import { ChildSectionName } from "./../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { DisplayItemProps } from "./DisplayListBuilder";
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
  get feStoreSolver(): FeIndexSolver<any> {
    const { feIndexStoreName } = this.get;
    if (!feIndexStoreName) {
      throw new Error("This can't be null.");
    }
    return FeIndexSolver.init(feIndexStoreName, this.solverSectionsProps);
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
  loadFromLocalStore(dbId: string): void {
    const sectionPack = this.feStoreSolver.getItemPack(dbId);
    this.loadSectionPack(sectionPack);
  }
  prepForCompare<SN extends ChildSectionName<"omniParent">>(
    sectionPack: SectionPack<SN>
  ): SectionPack<SN> {
    return this.feUserSolver.prepForCompare(sectionPack);
  }
  getPreppedSaveStatusPacks() {
    return {
      loaded: this.prepForCompare(this.packMaker.makeSectionPack()),
      saved: this.prepForCompare(this.asSavedPack),
    };
  }
  get saveStatus(): SaveStatus {
    if (!this.isSaved) {
      return "unsaved";
    } else {
      const { loaded, saved } = this.getPreppedSaveStatusPacks();
      const areEqual = isEqual(loaded, saved);
      // if (!areEqual) {
      //   const diffs = Obj.difference(loaded, saved);
      //   console.log(JSON.stringify(diffs));
      // }
      if (areEqual) {
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
    return this.feStoreSolver.hasByDbId(this.dbId);
  }
  get displayItems(): DisplayItemProps[] {
    return this.feStoreSolver.displayItems;
  }
  makeACopy() {
    this.updater.newDbId();
    const titleValue = this.get.valueNext("displayName") as StringObj;
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
    this.feStoreSolver.removeItem(dbId);
  }
  deleteSelfFromIndex() {
    this.deleteFromIndex(this.dbId);
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
    this.feStoreSolver.addItem(sectionPack);
  }
  saveUpdates() {
    this.solver.updateValuesAndSolve({
      dateTimeLastSaved: timeS.now(),
    } as Partial<SectionValues<SN>>);
    const sectionPack = this.packMaker.makeSectionPack();
    this.feStoreSolver.updateItem(sectionPack);
  }
  get asSavedPack(): SectionPack<SN> {
    return this.feStoreSolver.getItemPack(this.dbId);
  }
}
