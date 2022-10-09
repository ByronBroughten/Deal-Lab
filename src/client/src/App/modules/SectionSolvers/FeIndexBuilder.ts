import { ChildSectionName } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/ChildSectionName";
import { SectionPack } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
import { FeSectionInfo } from "../../sharedWithServer/SectionsMeta/Info";
import { FeStoreNameByType } from "../../sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/FeStoreName";
import { SectionNameByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import { GetterSections } from "../../sharedWithServer/StateGetters/GetterSections";
import { PackBuilderSection } from "../../sharedWithServer/StatePackers.ts/PackBuilderSection";
import { SolverListBase } from "../../sharedWithServer/StateSolvers/SolverBases/SolverListBase";
import { DisplayIndexBuilder } from "./DisplayIndexBuilder";
import { FullIndexBuilder } from "./FullIndexBuilder";

export class FeIndexBuilder<
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
  get primaryIndex(): DisplayIndexBuilder<any> | FullIndexBuilder<any> {
    if (this.hasFeDisplayIndex) {
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
  removeAsSavedExtras(loadedDbIds: string[]) {
    if (this.hasFeDisplayIndex) {
      this.displayIndexBuilder.removeAsSavedExtras(loadedDbIds);
    }
  }
  deleteFromIndex(dbId: string) {
    if (this.hasFeDisplayIndex) {
      this.displayIndexBuilder.removeItem(dbId);
    }
    if (this.hasFullIndex) {
      this.fullIndexBuilder.removeItem(dbId);
    }
  }

  addItem(sectionPack: SectionPack<SN>): void {
    if (this.hasFeDisplayIndex) {
      this.displayIndexBuilder.addItem(sectionPack as any);
    }
    if (this.hasFullIndex) {
      this.fullIndexBuilder.addItem(sectionPack as SectionPack<any>);
    }
  }
  updateItem(sectionPack: SectionPack<SN>) {
    if (this.hasFeDisplayIndex) {
      this.displayIndexBuilder.updateItem(sectionPack as any);
    }
    if (this.hasFullIndex) {
      this.fullIndexBuilder.updateItem(sectionPack as SectionPack<any>);
    }
  }
  getAsSavedPack(dbId: string): SectionPack<SN> {
    if (this.hasFeDisplayIndex) {
      const asSaved = this.displayIndexBuilder.getAsSaved(dbId);
      return asSaved.makeSectionPack() as SectionPack<SN>;
    } else {
      return this.fullIndexBuilder.getItemPack(dbId);
    }
  }
}
