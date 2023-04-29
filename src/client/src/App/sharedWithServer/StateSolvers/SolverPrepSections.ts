import { FeChildInfo } from "../SectionsMeta/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { FeSectionInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import {
  activeDealPathIdx,
  SectionPathContextName,
} from "../SectionsMeta/sectionPathContexts";
import { StoreName } from "../SectionsMeta/sectionStores";
import { GetterSections } from "../StateGetters/GetterSections";
import { InEntityGetterSections } from "../StateGetters/InEntityGetterSections";
import { AddChildOptions } from "../StateUpdaters/UpdaterSection";
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
  applyVariablesToDealSystem(feId: string) {
    this.adderPrepSections.applyVariablesToDealSystem(feId);
    this.addAppWideMissingOutEntities();
  }
  applyVariablesToDealSystems() {
    this.adderPrepSections.applyVariablesToDealSystems();
    this.addAppWideMissingOutEntities();
  }

  getActiveDeal(): SolverPrepSection<"deal"> {
    const { feInfo } = this.getterSections.getActiveDeal();
    return this.prepperSection(feInfo);
  }
  hasActiveDeal(): boolean {
    return this.getterSections.hasActiveDeal();
  }
  private getActiveDeals(): SolverPrepSection<"deal">[] {
    return this.getterSections
      .getActiveDeals()
      .map(({ feInfo }) => this.prepperSection(feInfo));
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
  deactivateDealAndDealSystem(): void {
    this.deactivateDeals();
    this.removeActiveDealSystems();
    this.reAddOutputSection({ sectionContextName: "latentDealSystem" });
  }
  private removeActiveDealSystems() {
    const main = this.oneAndOnly("main");
    const systems = main.children("activeDealSystem");
    for (const system of systems) {
      system.removeSelf();
    }
  }
  private updateActiveSystems(dealId: string) {
    this.removeActiveDealSystems();
    const main = this.oneAndOnly("main");
    const contextOptions = {
      contextPathIdxSpecifier: {
        [activeDealPathIdx]: {
          feId: dealId,
          selfChildName: "dealMain",
        },
      },
    } as const;
    main.addChild("activeDealSystem", contextOptions);
    this.reAddOutputSection(contextOptions);
  }
  private reAddOutputSection(props: AddChildOptions<"outputSection">) {
    const feStore = this.oneAndOnly("feStore");
    const outputSection = feStore.onlyChild("outputSection");
    const outputPack = outputSection.get.makeSectionPack();
    outputSection.removeSelf();
    const nextOutputSection = feStore.addAndGetChild("outputSection", props);
    nextOutputSection.loadSelfSectionPack(outputPack);
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
