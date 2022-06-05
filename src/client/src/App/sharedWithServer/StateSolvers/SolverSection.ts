import { defaultMaker } from "../Analyzer/methods/internal/addSections/gatherSectionInitProps/defaultMaker";
import { SectionPackRaw } from "../Analyzer/SectionPackRaw";
import { VarbValues } from "../Analyzer/StateSection/methods/varbs";
import { VarbInfo } from "../SectionsMeta/Info";
import { ChildName } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { ParentNameSafe } from "../SectionsMeta/relSectionTypes/ParentTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSectionProps } from "../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../StateGetters/GetterSection";
import { GetterSections } from "../StateGetters/GetterSections";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { PackLoaderSection } from "../StatePackers.ts/PackLoaderSection";
import { StateSections } from "../StateSections/StateSectionsNext";
import { DefaultOrNewChildAdder } from "../StateUpdaters/DefaultOrNewDescendantAdder";
import {
  AddChildOptions,
  UpdaterSection,
} from "../StateUpdaters/UpdaterSection";
import { Arr } from "../utils/Arr";
import { Obj } from "../utils/Obj";
import {
  SolverSectionBase,
  SolverSectionProps,
} from "./SolverBases/SolverSectionBase";
import { HasSolveShare } from "./SolverBases/SolverSectionsBase";
import { SolverSections } from "./SolverSections";
import { SolverVarb } from "./SolverVarb";

interface SolverSectionInitProps<SN extends SectionName>
  extends GetterSectionProps<SN>,
    Partial<HasSolveShare> {}

// function varbInfosToSolveAfterErase(
//   analyzer: Analyzer,
//   feInfo: FeInfo | FeInfo[]
// ): FeVarbInfo[] {
//   const nestedVarbInfos = analyzer.nestedFeVarbInfos(feInfo);
//   const nestedOutVarbInfos = analyzer.nestedFeOutVarbInfos(feInfo);
//   return nestedOutVarbInfos.filter((feInfo) => {
//     return !Arr.objIsIn(feInfo, nestedVarbInfos);
//   });
// }

export class SolverSection<
  SN extends SectionName
> extends SolverSectionBase<SN> {
  private getterSections = new GetterSections(
    this.getterSectionsBase.getterSectionsProps
  );
  private defaultAdder = new DefaultOrNewChildAdder(
    this.getterSectionBase.getterSectionProps
  );
  private updater = new UpdaterSection(this.getterSectionProps);
  private loader = new PackLoaderSection(this.getterSectionProps);
  private getterSection = new GetterSection(this.getterSectionProps);
  private solverSections = new SolverSections(this.solverSectionsProps);

  get get(): GetterSection<SN> {
    return this.getterSection;
  }

  static init<S extends SectionName>(
    props: SolverSectionInitProps<S>
  ): SolverSection<S> {
    if (!props.solveShare) {
      props.solveShare = {
        varbIdsToSolveFor: new Set(),
      };
    }
    return new SolverSection(props as SolverSectionProps<S>);
  }
  get varbIdsToSolveFor(): Set<string> {
    return this.solveShare.varbIdsToSolveFor;
  }
  get selfAndDescendantOutVarbIds(): string[] {
    return GetterVarb.varbInfosToVarbIds(this.selfAndDescendantOutVarbInfos);
  }
  get selfAndDescendantOutVarbInfos(): VarbInfo[] {
    const outVarbInfos: VarbInfo[] = [];
    const { selfAndDescendantVarbInfos } = this.getterSection;
    for (const varbInfo of selfAndDescendantVarbInfos) {
      const solverVarb = new SolverVarb({
        ...this.solverSectionsProps,
        ...varbInfo,
      });
      outVarbInfos.push(...solverVarb.outVarbInfos);
    }
    return outVarbInfos;
  }
  removeSelfAndSolve(): void {
    this.removeSelf();
    this.solve();
  }
  private removeSelf(): void {
    const { selfAndDescendantVarbIds } = this.getterSection;
    const { selfAndDescendantOutVarbIds } = this;
    const varbIdsToSolveFor = Arr.exclude(
      selfAndDescendantOutVarbIds,
      selfAndDescendantVarbIds
    );
    this.addVarbIdsToSolveFor(...varbIdsToSolveFor);
    this.updater.removeSelf();
  }
  resetSelfAndSolve(): void {
    const { feId, idx } = this.get;
    const { parent } = this;
    this.removeSelf();
    parent.addChild(this.get.sectionName as any, { feId, idx });
    this.solve();
  }
  private get parent(): SolverSection<ParentNameSafe<SN>> {
    const { parentInfoSafe } = this.updater.get;
    return new SolverSection({
      ...this.solverSectionsProps,
      ...parentInfoSafe,
    });
  }
  addChildAndSolve<CN extends ChildName<SN>>(
    childName: ChildName<SN>,
    options?: AddChildOptions<CN>
  ): void {
    this.addChild(childName, options);
    this.solve();
  }
  private addChild<CN extends ChildName<SN>>(
    childName: ChildName<SN>,
    options?: AddChildOptions<CN>
  ) {
    this.defaultAdder.addChild(childName, options);
    const { selfAndDescendantVarbInfos } =
      this.getterSections.newestEntry(childName);
    this.addVarbInfosToSolveFor(...selfAndDescendantVarbInfos);
  }
  private addSibling(options?: AddChildOptions<SN>) {
    this.parent.addChild(this.get.sectionName as any, options);
  }
  updateValuesAndSolve(values: VarbValues): void {
    this.updater.updateValuesDirectlyAndSolve(values);
    const varbNames = Obj.keys(values) as string[];
    const varbInfos = varbNames.map((varbName) => this.get.varbInfo(varbName));
    this.addVarbInfosToSolveFor(...varbInfos);
    this.solve();
  }
  loadSelfSectionPack(sectionPack: SectionPackRaw<SN>) {
    this.loader.updateSelfWithSectionPack(sectionPack);
    const { selfAndDescendantVarbInfos } = this.getterSection;
    this.addVarbInfosToSolveFor(...selfAndDescendantVarbInfos);
    this.solve();
  }
  private solve() {
    this.solverSections.solve();
  }
  static initSolvedSectionsFromMainPack(
    sectionPack: SectionPackRaw<"main">
  ): StateSections {
    const sections = StateSections.initWithMain();
    const loader = SolverSection.init({
      ...sections.rawSectionList("main")[0],
      sectionsShare: { sections },
    });
    loader.loadSelfSectionPack(sectionPack);
    return loader.sectionsShare.sections;
  }
  static initSectionsFromDefaultMain() {
    const defaultMainPack = defaultMaker.make("main");
    return this.initSolvedSectionsFromMainPack(defaultMainPack);
  }
}
