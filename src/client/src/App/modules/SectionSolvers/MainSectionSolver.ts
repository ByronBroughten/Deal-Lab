import isEqual from "fast-deep-equal";
import {
  SectionValues,
  SomeSectionValues,
} from "../../sharedWithServer/SectionsMeta/baseSectionsDerived/valueMetaTypes";
import { SelfChildName } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/ParentName";
import { SectionPack } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
import { FeParentInfo } from "../../sharedWithServer/SectionsMeta/Info";
import { SectionNameByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import { PackMakerSection } from "../../sharedWithServer/StatePackers.ts/PackMakerSection";
import {
  SolverSectionBase,
  SolverSectionProps,
} from "../../sharedWithServer/StateSolvers/SolverBases/SolverSectionBase";
import { SolverSection } from "../../sharedWithServer/StateSolvers/SolverSection";
import { UpdaterSection } from "../../sharedWithServer/StateUpdaters/UpdaterSection";
import { timeS } from "../../sharedWithServer/utils/date";
import { FeIndexSolver } from "./FeIndexSolver";
import { FeUserSolver } from "./FeUserSolver";

// using the indexBuilder rather than indexSolver works for the mainStores
// they should probably not solve or remove, too though

// and the listStores should probably solve on updates, no?

// I every time the index store will be edited, it checks whether
// sectionName is mainStoreName or listStoreName and uses solver/builder accordingly
// This works I suppose, as long as I unify the props and names of the
// relevant solver/builder methods

export type SaveStatus = "unsaved" | "changesSynced" | "unsyncedChanges";
export class MainSectionSolver<
  SN extends SectionNameByType<"hasIndexStore">
> extends SolverSectionBase<SN> {
  private parentInfoCache: FeParentInfo<SN>;
  private selfChildNameCache: SelfChildName<SN>;
  constructor(props: SolverSectionProps<SN>) {
    super(props);
    this.parentInfoCache = this.get.parentInfo;
    this.selfChildNameCache = this.get.selfChildName;
  }
  private updateCaches() {
    this.parentInfoCache = this.get.parentInfo;
    this.selfChildNameCache = this.get.selfChildName;
  }
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
    this.updateCaches();
    this.solver.removeSelfAndSolve();
    this.sectionUnloadCleanup();
  }
  replaceWithDefault() {
    this.updateCaches();
    this.solver.replaceWithDefaultAndSolve();
    this.sectionUnloadCleanup();
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
    this.updateCaches();
    this.sectionUnloadCleanup();
  }
  loadSectionPack(sectionPack: SectionPack<SN>) {
    this.updateCaches();
    this.solver.loadSelf(sectionPack);
    this.sectionUnloadCleanup();
    this.sectionLoadCleanup(sectionPack);
  }
  sectionLoadCleanup(sectionPack: SectionPack<SN>) {
    this.indexSolver.addAsSavedIfMissing(sectionPack);
  }
  private sectionUnloadCleanup() {
    // caches should be updated before this is used.
    const parent = this.getterSections.section(this.parentInfoCache);
    const childName = this.selfChildNameCache;
    const siblingDbIds = parent.children(childName).map(({ dbId }) => dbId);
    this.indexSolver.removeAsSavedExtras(siblingDbIds);
  }

  deleteFromIndex(dbId: string) {
    this.indexSolver.deleteFromIndex(dbId);
  }
  deleteSelfFromIndex() {
    this.indexSolver.deleteFromIndex(this.dbId);
  }
  saveNew() {
    const dateTime = timeS.now();
    this.solver.updateValuesAndSolve({
      dateTimeFirstSaved: dateTime,
      dateTimeLastSaved: dateTime,
      syncStatus: "autoSyncOff",
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
