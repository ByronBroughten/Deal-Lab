import isEqual from "fast-deep-equal";
import { SectionPack } from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/SectionPack";
import { FeSectionInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionNameByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import { SectionValues } from "../../sharedWithServer/SectionsMeta/values/StateValue";
import { StringObj } from "../../sharedWithServer/SectionsMeta/values/StateValue/StringObj";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import { PackBuilderSection } from "../../sharedWithServer/StatePackers/PackBuilderSection";
import { PackMakerSection } from "../../sharedWithServer/StatePackers/PackMakerSection";
import { SolverSectionBase } from "../../sharedWithServer/StateSolvers/SolverBases/SolverSectionBase";
import { SolverSection } from "../../sharedWithServer/StateSolvers/SolverSection";
import { UpdaterSection } from "../../sharedWithServer/StateUpdaters/UpdaterSection";
import { timeS } from "../../sharedWithServer/utils/timeS";
import { ChildSectionName } from "./../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { DisplayItemProps, FeIndexSolver } from "./FeIndexSolver";

export type SaveStatus = "unsaved" | "changesSynced" | "unsyncedChanges";
export class MainSectionSolver<
  SN extends SectionNameByType<"hasIndexStore">
> extends SolverSectionBase<SN> {
  get solver(): SolverSection<SN> {
    return new SolverSection(this.solverSectionProps);
  }
  get updater(): UpdaterSection<SN> {
    return new UpdaterSection(this.solverSectionProps);
  }
  get get(): GetterSection<SN> {
    return new GetterSection(this.getterSectionProps);
  }
  get packMaker(): PackMakerSection<SN> {
    return new PackMakerSection(this.getterSectionProps);
  }
  get getterSections(): GetterSections {
    return new GetterSections(this.solverSectionsProps);
  }
  get storeSolver(): FeIndexSolver<any> {
    const { mainStoreName } = this.get;
    if (!mainStoreName) {
      throw new Error("This can't be null.");
    }
    return FeIndexSolver.init(mainStoreName, this.solver.solverSectionsProps);
  }
  get dbId(): string {
    return this.get.dbId;
  }
  loadFromLocalStore(dbId: string): void {
    const sectionPack = this.storeSolver.getItemPack(dbId);
    this.loadSectionPack(sectionPack);
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
    return this.storeSolver.hasByDbId(this.dbId);
  }
  get displayItems(): DisplayItemProps[] {
    return this.storeSolver.displayItems;
  }
  makeACopy(): SectionPack<SN> {
    const sectionPack = this.packMaker.makeSectionPack();
    const clone = SolverSection.initFromPackAsOmniChild(sectionPack);

    clone.updater.newDbId();
    const name = clone.get.valueNext("displayName");
    const nextName: StringObj = {
      ...name,
      mainText: "Copy of " + name.mainText,
    };
    clone.updateValuesAndSolve({
      displayName: nextName,
    } as Partial<SectionValues<SN>>);
    const clonePack = clone.packMaker.makeSectionPack();
    this.storeSolver.addItem(clonePack);
    return clonePack;
  }
  makeSelfACopy() {
    this.updater.newDbId();
    const name = this.get.valueNext("displayName");
    const nextName: StringObj = {
      ...name,
      mainText: "Copy of " + name.mainText,
    };
    this.solver.updateValuesAndSolve({
      displayName: nextName,
    } as Partial<SectionValues<SN>>);
  }
  copyMinusNameChange() {
    this.updater.newDbId();
  }
  loadSectionPack(sectionPack: SectionPack<SN>) {
    this.solver.loadSelfAndSolve(sectionPack);
  }

  deleteFromIndex(dbId: string) {
    this.storeSolver.removeItem(dbId);
  }
  deleteSelfFromIndex() {
    this.deleteFromIndex(this.dbId);
  }
  saveSelfNew() {
    const dateTime = timeS.now();
    this.solver.updateValuesAndSolve({
      dateTimeFirstSaved: dateTime,
      dateTimeLastSaved: dateTime,
      autoSyncControl: "autoSyncOff",
    } as Partial<SectionValues<SN>>);
    const sectionPack = this.packMaker.makeSectionPack();
    this.storeSolver.addItem(sectionPack);
  }
  saveUpdates() {
    this.solver.updateValuesAndSolve({
      dateTimeLastSaved: timeS.now(),
    } as Partial<SectionValues<SN>>);
    const sectionPack = this.packMaker.makeSectionPack();
    this.storeSolver.updateItem(sectionPack);
  }
  get asSavedPack(): SectionPack<SN> {
    return this.storeSolver.getItemPack(this.dbId);
  }
  prepForCompare<SN extends ChildSectionName<"omniParent">>(
    sectionPack: SectionPack<SN>
  ): SectionPack<SN> {
    const headSection = PackBuilderSection.loadAsOmniChild(sectionPack);
    const { sections } = headSection;
    let sectionInfos: FeSectionInfo[] = [headSection.feInfo];
    while (sectionInfos.length > 0) {
      const nextInfos: FeSectionInfo[] = [];
      for (const info of sectionInfos) {
        const section = sections.section(info);
        section.updater.resetSolvableTexts();
        for (const childName of section.get.childNames) {
          for (const child of section.children(childName)) {
            const getterChild = child.get;
            if (getterChild.isSectionType("hasIndexStore")) {
              if (getterChild.valueNext("autoSyncControl") === "autoSyncOn") {
                const store = this.sectionFeSolver(getterChild.feInfo);
                if (store.hasByDbId(getterChild.dbId)) {
                  child.removeSelf();
                }
              }
            }
            nextInfos.push(child.feInfo);
          }
        }
      }
      sectionInfos = nextInfos;
    }
    return headSection.makeSectionPack();
  }
  private sectionFeSolver(feInfo: FeSectionInfo): FeIndexSolver<any> {
    const { mainStoreName } = this.get.getterSection(feInfo);
    return FeIndexSolver.init(mainStoreName, this.solver.solverSectionsProps);
  }
}
