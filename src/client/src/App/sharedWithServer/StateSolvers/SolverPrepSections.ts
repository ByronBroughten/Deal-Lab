import { FeChildInfo } from "../SectionsMeta/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { FeSectionInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import {
  activeDealPathIdx,
  SectionPathContextName,
} from "../SectionsMeta/sectionPathContexts";
import { StoreName } from "../SectionsMeta/sectionStores";
import { GetterSections } from "../StateGetters/GetterSections";
import { InEntityGetterSections } from "../StateGetters/InEntityGetterSections";
import { Arr } from "../utils/Arr";
import { SolverAdderPrepSections } from "./SolverAdderPrepSections";
import { SolverSectionsBase } from "./SolverBases/SolverSectionsBase";
import { SolverPrepSection } from "./SolverPrepSection";
import { SolverVarb } from "./SolverVarb";

export class SolverPrepSections extends SolverSectionsBase {
  prepperSection<S extends SectionName>(feInfo: FeSectionInfo<S>) {
    return new SolverPrepSection({
      ...this.solverSectionsProps,
      ...feInfo,
    });
  }
  get getterSections() {
    return new GetterSections(this.getterSectionsBase.getterSectionsProps);
  }
  private get adderPrepSections() {
    return new SolverAdderPrepSections(this.solverSectionsProps);
  }
  private get inEntitySections() {
    return new InEntityGetterSections(
      this.getterSectionsBase.getterSectionsProps
    );
  }
  oneAndOnly<SN extends SectionName>(sectionName: SN): SolverPrepSection<SN> {
    const { feInfo } = this.getterSections.oneAndOnly(sectionName);
    return this.prepperSection(feInfo);
  }
  addAppWideMissingOutEntities(): void {
    const { appWideVarbInfosWithInEntities } = this.inEntitySections;
    for (const feVarbInfo of appWideVarbInfosWithInEntities) {
      const solverVarb = new SolverVarb({
        ...this.solverSectionsProps,
        ...feVarbInfo,
      });
      solverVarb.addOutEntitiesFromAllInEntities();
    }
  }
  applyVariablesToDealPage(
    feInfo: FeSectionInfo<SectionNameByType<"dealSupports">>
  ) {
    this.adderPrepSections.applyVariablesToDealPage(feInfo);
    this.addAppWideMissingOutEntities();
  }
  applyVariablesToDealPages() {
    this.adderPrepSections.applyVariablesToDealPages();
    this.addAppWideMissingOutEntities();
  }

  getActiveDeal(): SolverPrepSection<"deal"> {
    const deals = this.getActiveDeals();
    return Arr.getOnlyOne(deals, "activeDeals");
  }
  hasActiveDeal(): boolean {
    const deals = this.getActiveDeals();
    if (deals.length === 1) {
      return true;
    } else if (deals.length === 0) {
      return false;
    } else {
      throw new Error(
        "There should only be one active deal at a time, but there are more"
      );
    }
  }
  private getActiveDeals(): SolverPrepSection<"deal">[] {
    const feStore = this.oneAndOnly("feStore");
    const deals = feStore.children("dealMain");
    return deals.filter((deal) => {
      const { sectionContextName } = deal.get;
      if (sectionContextName === "activeDealSystem") {
        return true;
      } else return false;
    });
  }

  activateDeal(feId: string): void {
    if (this.hasActiveDeal() && this.getActiveDeal().get.feId === feId) {
      return;
    }

    this.deactivateDeals();
    this.changeStoreSectionContext(
      {
        childName: "dealMain",
        feId,
      },
      "activeDealSystem"
    );
    this.updateActiveSystems(feId);
  }
  private updateActiveSystems(dealId: string) {
    const main = this.oneAndOnly("main");
    const systems = main.children("activeDealSystem");
    for (const system of systems) {
      system.removeSelf();
    }
    main.addChild("activeDealSystem", {
      contextPathIdxSpecifier: {
        [activeDealPathIdx]: {
          feId: dealId,
          selfChildName: "dealMain",
        },
      },
    });
  }
  private deactivateDeals(): void {
    const activeDeals = this.getActiveDeals();
    for (const deal of activeDeals) {
      this.changeStoreSectionContext(
        {
          childName: "dealMain",
          feId: deal.get.feId,
        },
        "latentDealSystem"
      );
    }
  }
  private changeStoreSectionContext<CN extends StoreName>(
    storeInfo: FeChildInfo<"feStore", CN>,
    sectionContextName: SectionPathContextName
  ) {
    const { childName } = storeInfo;
    const feStore = this.oneAndOnly("feStore");
    const section = feStore.child(storeInfo).get;
    const { idx, feId, dbId } = section;
    const sectionPack = section.packMaker.makeSectionPack();
    feStore.removeChildByDbId({
      childName,
      dbId,
    });
    feStore.loadChild({
      childName: childName,
      sectionPack: sectionPack as SectionPack<ChildSectionName<"feStore", CN>>,
      sectionContextName,
      feId,
      idx,
    });
  }
}
