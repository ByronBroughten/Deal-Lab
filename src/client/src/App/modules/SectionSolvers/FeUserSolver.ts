import { AnalyzerPlanValues } from "../../sharedWithServer/apiQueriesShared/AnalyzerPlanValues";
import { defaultMaker } from "../../sharedWithServer/defaultMaker/defaultMaker";
import { ChildName } from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { SectionPack } from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/SectionPack";
import { FeSectionInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionNameByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import { StateValue } from "../../sharedWithServer/SectionsMeta/values/StateValue";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { PackBuilderSection } from "../../sharedWithServer/StatePackers.ts/PackBuilderSection";
import { SolverSectionBase } from "../../sharedWithServer/StateSolvers/SolverBases/SolverSectionBase";
import { SolverSection } from "../../sharedWithServer/StateSolvers/SolverSection";
import { FeIndexSolver } from "./FeIndexSolver";
import { MainSectionSolver } from "./MainSectionSolver";

export class FeUserSolver extends SolverSectionBase<"feStore"> {
  get get(): GetterSection<"feStore"> {
    return new GetterSection(this.getterSectionProps);
  }
  get packBuilder() {
    return new PackBuilderSection(this.getterSectionProps);
  }
  get solver(): SolverSection<"feStore"> {
    return new SolverSection(this.solverSectionProps);
  }
  get isLoggedIn(): boolean {
    return !this.isGuest;
  }
  get authStatus(): StateValue<"authStatus"> {
    return this.get.valueNext("authStatus");
  }
  get isGuest(): boolean {
    return this.authStatus === "guest";
  }

  static initDefault() {
    const feStore = PackBuilderSection.initAsOmniChild("feStore");
    feStore.loadSelf(defaultMaker.makeSectionPack("feStore"));
    return new FeUserSolver({
      ...FeUserSolver.initProps({ sections: feStore.sectionsShare.sections }),
      ...feStore.getterSectionProps,
    });
  }
  loadSubscriptionInfo({
    labSubscription,
    labSubscriptionExp,
  }: AnalyzerPlanValues): void {
    this.solver.updateValuesAndSolve({
      labSubscription,
      labSubscriptionExp,
    });
  }
  mainSolver<SN extends SectionNameByType<"hasIndexStore">>(
    feInfo: FeSectionInfo<SN>
  ): MainSectionSolver<SN> {
    return new MainSectionSolver({
      ...this.solverSectionProps,
      ...feInfo,
    });
  }
  storeSolver<CN extends ChildName<"feStore">>(
    itemName: CN
  ): FeIndexSolver<any> {
    return FeIndexSolver.init(itemName, this.solverSectionsProps);
  }
  sectionFeSolver(feInfo: FeSectionInfo): FeIndexSolver<any> {
    const { mainStoreName } = this.get.getterSection(feInfo);
    return this.storeSolver(mainStoreName);
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
}
