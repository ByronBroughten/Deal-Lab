import { ChildSectionName } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/ChildSectionName";
import { SectionPack } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
import { FeSectionInfo } from "../../sharedWithServer/SectionsMeta/Info";
import { FeStoreNameByType } from "../../sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/FeStoreName";
import { SectionNameByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import { PackBuilderSection } from "../../sharedWithServer/StatePackers.ts/PackBuilderSection";
import { SolverListBase } from "../../sharedWithServer/StateSolvers/SolverBases/SolverListBase";
import { DisplayIndexBuilder } from "./DisplayIndexBuilder";
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
  get displayIndexBuilder() {
    if (!this.hasFeDisplayIndex) {
      throw new Error(`${this.getL.sectionName} has no display index store`);
    }
    const { displayIndexName } = this.sectionMeta;
    return this.makeDisplayIndexBuilder(displayIndexName);
  }
  makeDisplayIndexBuilder<CN extends FeStoreNameByType<"displayIndex">>(
    displayIndexName: CN
  ): DisplayIndexBuilder<ChildSectionName<"feUser", CN>> {
    const feUser = this.getterSections.oneAndOnly("feUser");
    const store = feUser.onlyChild(displayIndexName);
    return new DisplayIndexBuilder({
      ...this.solverSectionsProps,
      ...store.feInfo,
    });
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
    if (this.hasFeDisplayIndex) {
      const asSaved = this.displayIndexBuilder.getAsSaved(dbId);
      return asSaved.makeSectionPack() as SectionPack<SN>;
    } else {
      return this.fullIndexSolver.getItemPack(dbId);
    }
  }
  removeAsSavedExtras(loadedDbIds: string[]): void {
    if (this.hasFeDisplayIndex) {
      this.displayIndexBuilder.removeAsSavedExtras(loadedDbIds);
    }
  }
  addAsSavedIfMissing(sectionPack: SectionPack<SN>) {
    if (this.hasFeDisplayIndex) {
      const headSection = PackBuilderSection.loadAsOmniChild(sectionPack);
      let sectionInfos: FeSectionInfo[] = [headSection.feInfo];
      while (sectionInfos.length > 0) {
        const nextInfos: FeSectionInfo[] = [];
        for (const info of sectionInfos) {
          const section = headSection.sections.section(info);
          for (const childName of section.get.childNames) {
            for (const child of section.children(childName)) {
              if (child.isSectionType("hasFeDisplayIndex")) {
                const { displayIndexName } = child.sectionMeta;
                const displayIndexBuilder =
                  this.makeDisplayIndexBuilder(displayIndexName);

                displayIndexBuilder.addAsSavedIfMissing(
                  child.makeSectionPack() as any
                  // It's probably fastest to just check all the displayIndexes
                  // after each operation and load the sections as saved as necessary
                  // Do the same for removing.
                  // Updating should be fine
                );
              }
            }
          }
        }
        sectionInfos = nextInfos;
      }
    }
  }
}
