import { AnalyzerPlanValues } from "../../sharedWithServer/apiQueriesShared/AnalyzerPlanValues";
import { defaultMaker } from "../../sharedWithServer/defaultMaker/defaultMaker";
import { AutoSyncControl } from "../../sharedWithServer/SectionsMeta/baseSectionsDerived/subValues";
import { AuthStatus } from "../../sharedWithServer/SectionsMeta/baseSectionsVarbsValues";
import { ChildSectionName } from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { SectionPack } from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/SectionPack";
import { FeSectionInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionNameByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { PackBuilderSection } from "../../sharedWithServer/StatePackers.ts/PackBuilderSection";
import { SolverSectionBase } from "../../sharedWithServer/StateSolvers/SolverBases/SolverSectionBase";
import { SolverSection } from "../../sharedWithServer/StateSolvers/SolverSection";
import { FeIndexSolver } from "./FeIndexSolver";
import { MainSectionSolver } from "./MainSectionSolver";

export class FeUserSolver extends SolverSectionBase<"feUser"> {
  get get(): GetterSection<"feUser"> {
    return new GetterSection(this.getterSectionProps);
  }
  get packBuilder() {
    return new PackBuilderSection(this.getterSectionProps);
  }
  get solver(): SolverSection<"feUser"> {
    return new SolverSection(this.solverSectionProps);
  }
  get isLoggedIn(): boolean {
    return !this.isGuest;
  }
  get authStatus(): AuthStatus {
    return this.get.valueNext("authStatus") as AuthStatus;
  }
  get isGuest(): boolean {
    return this.authStatus === "guest";
  }

  static initDefault() {
    const feUser = PackBuilderSection.initAsOmniChild("feUser");
    feUser.loadSelf(defaultMaker.makeSectionPack("feUser"));
    return new FeUserSolver({
      ...FeUserSolver.initProps({
        sections: feUser.sectionsShare.sections,
        sectionContextName: "default",
      }),
      ...feUser.getterSectionProps,
    });
  }
  loadSubscriptionInfo({
    analyzerPlan,
    analyzerPlanExp,
  }: AnalyzerPlanValues): void {
    this.solver.updateValuesAndSolve({
      analyzerPlan,
      analyzerPlanExp,
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
  indexBuilder<SN extends SectionNameByType<"hasIndexStore">>(sectionName: SN) {
    return new FeIndexSolver({
      ...this.solverSectionsProps,
      sectionName,
    });
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
              if (
                getterChild.valueNext("autoSyncControl") ===
                ("autoSyncOn" as AutoSyncControl)
              ) {
                const indexBuilder = this.indexBuilder(getterChild.sectionName);
                if (indexBuilder.isSaved(getterChild.dbId)) {
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
