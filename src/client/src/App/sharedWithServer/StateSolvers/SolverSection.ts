import { SectionPack } from "../SectionPack/SectionPack";
import {
  SectionVarbName,
  VarbValues,
} from "../SectionsMeta/baseSectionsDerived/baseSectionTypes";
import {
  ChildName,
  FeChildInfo,
} from "../SectionsMeta/childSectionsDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/childSectionsDerived/ChildSectionName";
import { FeSectionInfo } from "../SectionsMeta/Info";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSectionProps } from "../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../StateGetters/GetterSection";
import {
  ChildPackInfo,
  ChildSectionPackArrs,
} from "../StatePackers.ts/PackLoaderSection";
import {
  AddChildOptions,
  UpdaterSection,
} from "../StateUpdaters/UpdaterSection";
import { Obj } from "../utils/Obj";
import { AddSolverSection } from "./AddSolverSection";
import { ComboSolverSection } from "./ComboSolverSection";
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
  get get() {
    return new GetterSection(this.getterSectionProps);
  }
  private solverSections = new SolverSections(this.solverSectionsProps);
  private get updater() {
    return new UpdaterSection(this.getterSectionProps);
  }
  private get remover() {
    return RemoveSolverSection.init(this.solverSectionProps);
  }
  private get adder() {
    return AddSolverSection.init(this.solverSectionProps);
  }
  private get combo() {
    return new ComboSolverSection(this.solverSectionProps);
  }
  get varbIdsToSolveFor(): Set<string> {
    return this.solveShare.varbIdsToSolveFor;
  }
  solverSection<S extends SectionName>(
    feInfo: FeSectionInfo<S>
  ): SolverSection<S> {
    return new SolverSection({
      ...this.solverSectionsProps,
      ...feInfo,
    });
  }
  youngestChild<CN extends ChildName<SN>>(
    childName: CN
  ): SolverSection<ChildSectionName<SN, CN>> {
    const { feInfo } = this.get.youngestChild(childName);
    return this.solverSection(feInfo);
  }
  private solve() {
    this.solverSections.solve();
  }
  updateValuesAndSolve(values: VarbValues): void {
    this.updater.updateValuesDirectly(values);
    const varbNames = Obj.keys(values) as SectionVarbName<SN>[];
    const varbInfos = varbNames.map((varbName) => this.get.varbInfo(varbName));

    this.addVarbInfosToSolveFor(...varbInfos);
    this.solve();
  }
  removeSelfAndSolve(): void {
    this.remover.removeSelfAndExtractVarbIds();
    this.solve();
  }
  removeChildrenAndSolve(childName: ChildName<SN>): void {
    this.remover.removeChildrenAndExtractVarbIds(childName);
    this.solve();
  }
  child<CN extends ChildName<SN>>(
    childInfo: FeChildInfo<SN, CN>
  ): SolverSection<ChildSectionName<SN, CN>> {
    const feInfo = this.get.childInfoToFe(childInfo);
    return this.solverSection(feInfo);
  }
  removeChildAndSolve<CN extends ChildName<SN>>(
    childInfo: FeChildInfo<SN, CN>
  ): void {
    if (this.get.hasChild(childInfo)) {
      const child = this.child(childInfo);
      child.removeSelfAndSolve();
    } else {
      const { childName, feId } = childInfo;
      throw new Error(
        `Section ${this.get.sectionName}.${this.get.feId} does not have child ${childName}.${feId}.`
      );
    }
  }
  resetToDefaultAndSolve(): void {
    this.combo.resetToDefaultAndExtractIds();
    this.solve();
  }
  replaceWithDefaultAndSolve(): void {
    this.combo.resetToDefaultAndExtractIds();
    this.updater.newDbId();
    this.solve();
  }
  loadSelfSectionPackAndSolve(sectionPack: SectionPack<SN>): void {
    this.combo.loadSelfSectionPackAndExtractIds(sectionPack);
    this.solve();
  }
  addChildAndSolve<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<SN, CN>
  ): void {
    this.adder.addChildAndFinalize(childName, options);
    this.solve();
  }
  loadChildPackAndSolve<CN extends ChildName<SN>>(
    childPackInfo: ChildPackInfo<SN, CN>
  ): void {
    const { childName, sectionPack } = childPackInfo;
    this.updater.addChild(childName);
    const child = this.youngestChild(childName);
    child.loadSelfSectionPackAndSolve(sectionPack);

    // while it's adding main, it jumbles loan varbs
    // into a property section...

    // I ought to set up something
    // in solverSections that verifies that
    // all the varbInfos being entered are valid.
  }
  loadChildPackArrsAndSolve(
    childPackArrs: Partial<ChildSectionPackArrs<SN>>
  ): void {
    this.combo.loadChildPackArrsAndExtractIds(childPackArrs);
    this.solve();
  }
}
