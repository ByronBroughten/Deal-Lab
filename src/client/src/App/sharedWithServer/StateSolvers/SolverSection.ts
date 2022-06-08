import { defaultMaker } from "../Analyzer/methods/internal/addSections/gatherSectionInitProps/defaultMaker";
import { VarbValues } from "../Analyzer/StateSection/methods/varbs";
import { SectionPackRaw } from "../SectionPack/SectionPackRaw";
import { FeSectionInfo } from "../SectionsMeta/Info";
import { ChildName } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { ParentNameSafe } from "../SectionsMeta/relSectionTypes/ParentTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSectionProps } from "../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../StateGetters/GetterSection";
import {
  ChildSectionPackArrs,
  PackLoaderSection,
} from "../StatePackers.ts/PackLoaderSection";
import { StateSections } from "../StateSections/StateSectionsNext";
import { DefaultOrNewChildAdder } from "../StateUpdaters/DefaultOrNewDescendantAdder";
import {
  AddChildOptions,
  UpdaterSection,
} from "../StateUpdaters/UpdaterSection";
import { Obj } from "../utils/Obj";
import { RemoveSolverSection } from "./RemoveSolverSection";
import {
  SolverSectionBase,
  SolverSectionProps,
} from "./SolverBases/SolverSectionBase";
import { HasSolveShare } from "./SolverBases/SolverSectionsBase";
import { SolverSections } from "./SolverSections";

interface SolverSectionInitProps<SN extends SectionName>
  extends GetterSectionProps<SN>,
    Partial<HasSolveShare> {}

export class SolverSection<
  SN extends SectionName
> extends SolverSectionBase<SN> {
  get = new GetterSection(this.getterSectionProps);
  private solverSections = new SolverSections(this.solverSectionsProps);
  private get updater() {
    return new UpdaterSection(this.getterSectionProps);
  }
  private get defaultAdder() {
    return new DefaultOrNewChildAdder(this.getterSectionProps);
  }
  private get remover() {
    return RemoveSolverSection.init(this.solverSectionProps);
  }
  private get loader() {
    return new PackLoaderSection(this.getterSectionProps);
  }
  get varbIdsToSolveFor(): Set<string> {
    return this.solveShare.varbIdsToSolveFor;
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
  solverSection<S extends SectionName>(
    feInfo: FeSectionInfo<S>
  ): SolverSection<S> {
    return new SolverSection({
      ...this.solverSectionsProps,
      ...feInfo,
    });
  }
  private get parent(): SolverSection<ParentNameSafe<SN>> {
    const { parentInfoSafe } = this.get;
    return new SolverSection({
      ...this.solverSectionsProps,
      ...parentInfoSafe,
    });
  }
  youngestChild<CN extends ChildName<SN>>(childName: CN): SolverSection<CN> {
    const { feInfo } = this.get.youngestChild(childName);
    return this.solverSection(feInfo);
  }
  private solve() {
    this.solverSections.solve();
  }
  updateValuesAndSolve(values: VarbValues): void {
    this.updater.updateValuesDirectlyAndSolve(values);
    const varbNames = Obj.keys(values) as string[];
    const varbInfos = varbNames.map((varbName) => this.get.varbInfo(varbName));
    this.addVarbInfosToSolveFor(...varbInfos);
    this.solve();
  }
  removeSelfAndSolve(): void {
    this.remover.removeSelfAndExtractVarbIds();
    this.solve();
  }
  removeChildAndSolve<CN extends ChildName<SN>>(
    feInfo: FeSectionInfo<CN>
  ): void {
    const child = this.solverSection(feInfo);
    child.removeSelfAndSolve();
  }
  replaceWithDefaultAndSolve(): void {
    const { feId, idx, sectionName } = this.get;
    const { parent } = this;
    this.remover.removeSelfAndExtractVarbIds();
    parent.addChild(sectionName as any, { feId, idx });
    this.solve();
  }
  loadSelfSectionPackAndSolve(sectionPack: SectionPackRaw<SN>): void {
    this.loader.updateSelfWithSectionPack(sectionPack);
    this.collectNestedVarbIds();
    this.solve();
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
    const child = this.youngestChild(childName);
    child.collectNestedVarbIds();
  }
  loadChildPackArrsAndSolve(
    childPackArrs: Partial<ChildSectionPackArrs<SN>>
  ): void {
    const childNames = Obj.keys(childPackArrs);
    this.remover.removeChildrenGroupsAndExtractVarbIds(childNames);
    for (const childName of childNames) {
      for (const childPack of (childPackArrs as ChildSectionPackArrs<SN>)[
        childName
      ]) {
        this.loadChildSectionPack(childPack);
      }
    }
    this.solve();
  }
  private loadChildSectionPack<CN extends ChildName<SN>>(
    sectionPack: SectionPackRaw<CN>
  ): void {
    this.loader.loadChildSectionPack(sectionPack);
    const child = this.youngestChild(sectionPack.sectionName);
    child.collectNestedVarbIds();
  }
  private collectNestedVarbIds() {
    const { selfAndDescendantVarbIds } = this.get;
    this.addVarbIdsToSolveFor(...selfAndDescendantVarbIds);
  }
  static initSolvedSectionsFromMainPack(
    sectionPack: SectionPackRaw<"main">
  ): StateSections {
    const sections = StateSections.initWithMain();
    const solver = SolverSection.init({
      ...sections.rawSectionList("main")[0],
      sectionsShare: { sections },
    });
    solver.loadSelfSectionPackAndSolve(sectionPack);
    return solver.sectionsShare.sections;
  }
  static initSectionsFromDefaultMain() {
    const defaultMainPack = defaultMaker.make("main");
    return this.initSolvedSectionsFromMainPack(defaultMainPack);
  }
}
