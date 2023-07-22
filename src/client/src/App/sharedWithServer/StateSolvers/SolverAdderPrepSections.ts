import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { FeSectionInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterList } from "../StateGetters/GetterList";
import { GetterSections } from "../StateGetters/GetterSections";
import { BasicSolvePrepperSection } from "./BasicSolvePrepperSection";
import { SolverSectionsBase } from "./SolverBases/SolverSectionsBase";

export class SolverAdderPrepSections extends SolverSectionsBase {
  adderPrepSection<S extends SectionName>(feInfo: FeSectionInfo<S>) {
    return new BasicSolvePrepperSection({
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
  ): BasicSolvePrepperSection<SN> {
    const { feInfo } = this.getterSections.oneAndOnly(sectionName);
    return this.adderPrepSection(feInfo);
  }
  applyVariablesToDealSystems() {
    const { feIds } = this.getterList("dealSystem");
    const userVarbPacks = this.getSavedUserVarbPacks();
    for (const feId of feIds) {
      this.applyVarbPacksToDealPage(feId, userVarbPacks);
    }
  }
  applyVariablesToDealSystem(feId: string) {
    const userVarbPacks = this.getSavedUserVarbPacks();
    this.applyVarbPacksToDealPage(feId, userVarbPacks);
  }
  private getSavedUserVarbPacks(): SectionPack<"numVarbList">[] {
    const feStore = this.oneAndOnly("feStore");
    const userVarbLists = feStore.get.children("numVarbListMain");
    return userVarbLists.map((list) => list.packMaker.makeSectionPack());
  }
  private applyVarbPacksToDealPage(
    feId: string,
    numVarbPacks: SectionPack<"numVarbList">[]
  ): void {
    const dealSystem = this.adderPrepSection({
      sectionName: "dealSystem",
      feId,
    });
    dealSystem.replaceChildPackArrs({
      numVarbList: numVarbPacks,
    });
  }
}
