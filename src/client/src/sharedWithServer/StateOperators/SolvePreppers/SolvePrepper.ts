import { GetterList } from "../../StateGetters/GetterList";
import { GetterSections } from "../../StateGetters/GetterSections";
import {
  FeSectionInfo,
  FeVarbInfo,
} from "../../StateGetters/Identifiers/FeInfo";
import {
  activeDealPathIdx,
  SectionPathContextName,
} from "../../StateGetters/Identifiers/sectionPaths/sectionPathContexts";
import { FeChildInfo } from "../../stateSchemas/fromSchema6SectionChildren/ChildName";
import { ChildSectionName } from "../../stateSchemas/fromSchema6SectionChildren/ChildSectionName";
import { SectionName } from "../../stateSchemas/schema2SectionNames";
import { StoreName } from "../../stateSchemas/schema6SectionChildren/sectionStores";
import { SectionPack } from "../../StateTransports/SectionPack";
import { defaultMaker } from "../defaultMaker/defaultMaker";
import { AddChildOptions } from "../Updaters/UpdaterSection";
import { SolvePrepperBase } from "./Bases/SolvePrepperBase";
import { SolvePrepperSection } from "./SolvePrepperSection";
import { SolvePrepperVarb } from "./SolvePrepperVarb";

export class SolvePrepper extends SolvePrepperBase {
  get getterSections() {
    return new GetterSections(this.getterSectionsBase.getterSectionsProps);
  }
  private getterList<SN extends SectionName>(sectionName: SN): GetterList<SN> {
    return new GetterList({
      ...this.getterSectionsBase,
      sectionName,
    });
  }
  prepperSection<S extends SectionName>(
    feInfo: FeSectionInfo<S>
  ): SolvePrepperSection<S> {
    return new SolvePrepperSection({
      ...this.solverProps,
      ...feInfo,
    });
  }
  prepperVarb<S extends SectionName>(
    varbInfo: FeVarbInfo<S>
  ): SolvePrepperVarb<S> {
    return new SolvePrepperVarb({
      ...this.solverProps,
      ...varbInfo,
    });
  }
  oneAndOnly<SN extends SectionName>(sectionName: SN): SolvePrepperSection<SN> {
    const { feInfo } = this.getterSections.oneAndOnly(sectionName);
    return this.prepperSection(feInfo);
  }
  applyVariablesToDealSystem(feId: string) {
    const userVarbPacks = this.getSavedUserVarbPacks();
    this.applyVarbPacksToDealSystem(feId, userVarbPacks);
  }
  applyVariablesToDealSystems() {
    const { feIds } = this.getterList("dealSystem");
    const userVarbPacks = this.getSavedUserVarbPacks();
    for (const feId of feIds) {
      this.applyVarbPacksToDealSystem(feId, userVarbPacks);
    }
  }
  private getSavedUserVarbPacks(): SectionPack<"numVarbList">[] {
    const feStore = this.oneAndOnly("feStore");
    const userVarbLists = feStore.get.children("numVarbListMain");
    return userVarbLists.map((list) => list.packMaker.makeSectionPack());
  }
  private applyVarbPacksToDealSystem(
    feId: string,
    numVarbPacks: SectionPack<"numVarbList">[]
  ): void {
    const dealSystem = this.prepperSection({
      sectionName: "dealSystem",
      feId,
    });
    dealSystem.replaceChildPackArrs({
      numVarbList: numVarbPacks,
    });
  }

  getActiveDeal(): SolvePrepperSection<"deal"> {
    const { feInfo } = this.getterSections.getActiveDeal();
    return this.prepperSection(feInfo);
  }
  hasActiveDeal(): boolean {
    return this.getterSections.hasActiveDeal();
  }
  private getActiveDeals(): SolvePrepperSection<"deal">[] {
    return this.getterSections
      .getActiveDeals()
      .map(({ feInfo }) => this.prepperSection(feInfo));
  }
  activateDeal(feId: string, finishEditLoading?: boolean): void {
    if (finishEditLoading) {
      // this should come first to ensure that dealDbIdToEdit
      // is reset when it needs to be.
      const session = this.oneAndOnly("sessionStore");
      session.updateValues({ dealDbIdToEdit: "" });
    }

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
  deactivateDealIfActive(feId: string) {
    if (this.getterSections.isActiveDeal(feId)) {
      this.deactivateDealAndDealSystem();
    }
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
    feStore.addChild(childName, {
      sectionPack: sectionPack as SectionPack<ChildSectionName<"feStore", CN>>,
      sectionContextName,
      feId,
      idx,
    });
  }

  static initDefaultAndActiveDeal(): SolvePrepper {
    const defaultMainPack = defaultMaker.makeSectionPack("main");
    const main = SolvePrepperSection.initMainFromPack(defaultMainPack);
    const { feId } = main.onlyChild("feStore").youngestChild("dealMain").get;
    main.prepper.activateDeal(feId);
    return main.prepper;
  }
}
