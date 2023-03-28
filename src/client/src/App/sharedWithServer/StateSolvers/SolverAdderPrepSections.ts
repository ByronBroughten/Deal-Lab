import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { FeSectionInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import {
  SectionNameByType,
  sectionNameS,
} from "../SectionsMeta/SectionNameByType";
import { GetterList } from "../StateGetters/GetterList";
import { GetterSections } from "../StateGetters/GetterSections";
import { SolverAdderPrepSection } from "./SolverAdderPrepSection";
import { SolverSectionsBase } from "./SolverBases/SolverSectionsBase";

export class SolverAdderPrepSections extends SolverSectionsBase {
  adderPrepSection<S extends SectionName>(feInfo: FeSectionInfo<S>) {
    return new SolverAdderPrepSection({
      ...this.solverSectionsProps,
      ...feInfo,
    });
  }
  private getterList<SN extends SectionName>(sectionName: SN): GetterList<SN> {
    return new GetterList({
      ...this.getterSectionsBase,
      sectionName,
    });
  }
  get getterSections() {
    return new GetterSections(this.getterSectionsBase.getterSectionsProps);
  }
  oneAndOnly<SN extends SectionName>(
    sectionName: SN
  ): SolverAdderPrepSection<SN> {
    const { feInfo } = this.getterSections.oneAndOnly(sectionName);
    return this.adderPrepSection(feInfo);
  }
  applyVariablesToDealPages() {
    for (const sectionName of sectionNameS.arrs.dealSupports) {
      const { feIds } = this.getterList(sectionName);
      const userVarbPacks = this.getSavedUserVarbPacks();
      for (const feId of feIds) {
        this.applyVarbPacksToDealPage(
          {
            sectionName,
            feId,
          },
          userVarbPacks
        );
      }
    }
  }
  applyVariablesToDealPage(
    feInfo: FeSectionInfo<SectionNameByType<"dealSupports">>
  ) {
    const userVarbPacks = this.getSavedUserVarbPacks();
    this.applyVarbPacksToDealPage(feInfo, userVarbPacks);
  }
  private getSavedUserVarbPacks(): SectionPack<"numVarbList">[] {
    const feStore = this.oneAndOnly("feStore");
    const userVarbLists = feStore.get.children("numVarbListMain");
    return userVarbLists.map((list) => list.packMaker.makeSectionPack());
  }
  private applyVarbPacksToDealPage(
    feInfo: FeSectionInfo<SectionNameByType<"dealSupports">>,
    numVarbPacks: SectionPack<"numVarbList">[]
  ): void {
    const dealSupport = this.adderPrepSection(feInfo);
    dealSupport.replaceChildPackArrs({
      numVarbList: numVarbPacks,
    });
  }
}
