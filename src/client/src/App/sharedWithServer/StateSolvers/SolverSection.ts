import { VarbName } from "../SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import {
  ChildName,
  DbChildInfo,
  FeChildInfo,
} from "../SectionsMeta/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { FeSectionInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { VarbInfoMixedFocal } from "../SectionsMeta/SectionInfo/MixedSectionInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { SectionValues, VarbValue } from "../SectionsMeta/values/StateValue";
import { GetterSectionProps } from "../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../StateGetters/GetterSection";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";
import {
  ChildPackInfo,
  ChildSectionPackArrs,
} from "../StatePackers/PackLoaderSection";
import { LoadChildSectionPackOptions } from "../StatePackers/PackLoaderSection/ChildPackLoader";
import { PackMakerSection } from "../StatePackers/PackMakerSection";
import { StateSections } from "../StateSections/StateSections";
import {
  AddChildOptions,
  UpdaterSection,
} from "../StateUpdaters/UpdaterSection";
import { SolverSectionBase } from "./SolverBases/SolverSectionBase";
import {
  HasSolveShare,
  SolverSectionsBase,
} from "./SolverBases/SolverSectionsBase";
import { SolverPrepSection } from "./SolverPrepSection";
import { SolverSections } from "./SolverSections";
import { SolverVarb } from "./SolverVarb";

interface SolverSectionInitProps<SN extends SectionName>
  extends GetterSectionProps<SN>,
    Partial<HasSolveShare> {}

export class SolverSection<
  SN extends SectionName
> extends SolverSectionBase<SN> {
  get prepper() {
    return new SolverPrepSection(this.solverSectionProps);
  }
  static init<S extends SectionName>(
    props: SolverSectionInitProps<S>
  ): SolverSection<S> {
    return new SolverSection({
      solveShare: SolverSectionsBase.initSolveShare(),
      ...props,
    });
  }
  static initFromPackAsOmniChild<SN extends ChildName<"omniParent">>(
    sectionPack: SectionPack<SN>
  ): SolverSection<SN> {
    const builder = PackBuilderSection.loadAsOmniChild(sectionPack);
    return SolverSection.init(builder.getterSectionProps);
  }
  static initDefaultMain(): SolverSection<"main"> {
    const sections = SolverSections.initSectionsFromDefaultMain();
    const mainRaw = sections.firstRawSection("main");
    return this.init({
      sectionsShare: { sections },
      ...mainRaw,
    });
  }
  get get(): GetterSection<SN> {
    return new GetterSection(this.getterSectionProps);
  }
  get packMaker(): PackMakerSection<SN> {
    return new PackMakerSection(this.getterSectionProps);
  }
  get builder(): PackBuilderSection<SN> {
    return new PackBuilderSection(this.getterSectionProps);
  }
  get solverSections() {
    return new SolverSections(this.solverSectionsProps);
  }
  get updater() {
    return new UpdaterSection(this.getterSectionProps);
  }
  get varbIdsToSolveFor(): Set<string> {
    return this.solveShare.varbIdsToSolveFor;
  }
  solverSection<S extends SectionNameByType>(
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
  get stateSections(): StateSections {
    return this.sectionsShare.sections;
  }
  solve() {
    this.solverSections.solve();
  }
  updateValuesAndSolve(values: Partial<SectionValues<SN>>): void {
    this.prepper.updateValues(values);
    this.solve();
  }
  removeSelfAndSolve(): void {
    this.prepper.removeSelf();
    this.solve();
  }
  removeChildrenAndSolve(childName: ChildName<SN>): void {
    this.prepper.removeChildren(childName);
    this.solve();
  }
  removeChildArrsAndSolve<CN extends ChildName<SN>>(childArrs: CN[]): void {
    this.prepper.removeChildArrs(childArrs);
    this.solve();
  }
  childByDbId<CN extends ChildName<SN>>(dbInfo: DbChildInfo<SN, CN>) {
    const { childName } = dbInfo;
    const { feId } = this.get.childByDbId(dbInfo);
    return this.child({
      childName,
      feId,
    });
  }
  removeChildByDbIdAndSolve<CN extends ChildName<SN>>(
    dbInfo: DbChildInfo<SN, CN>
  ) {
    this.prepper.removeChildByDbId(dbInfo);
    this.solve();
  }
  value<VN extends VarbName<SN>>(varbName: VN): VarbValue<SN, VN> {
    return this.get.valueNext(varbName);
  }
  varb<VN extends VarbName<SN>>(varbName: VN): SolverVarb<SN> {
    return new SolverVarb({
      ...this.solverSectionProps,
      varbName: varbName as string,
    });
  }
  varbByFocalMixed(mixedInfo: VarbInfoMixedFocal): SolverVarb {
    const { feVarbInfo } = this.get.varbByFocalMixed(mixedInfo);
    return new SolverVarb({
      ...this.solverSectionsProps,
      ...feVarbInfo,
    });
  }
  onlyChild<CN extends ChildName<SN>>(
    childName: CN
  ): SolverSection<ChildSectionName<SN, CN>> {
    const { feInfo } = this.get.onlyChild(childName);
    return this.solverSection(feInfo);
  }
  children<CN extends ChildName<SN>>(
    childName: CN
  ): SolverSection<ChildSectionName<SN, CN>>[] {
    const getters = this.get.children(childName);
    return getters.map(({ feInfo }) => this.solverSection(feInfo));
  }
  child<CN extends ChildName<SN>>(
    childInfo: FeChildInfo<SN, CN>
  ): SolverSection<ChildSectionName<SN, CN>> {
    const feInfo = this.get.childInfoToFe(childInfo);
    return this.solverSection(feInfo);
  }
  loadSelfAndSolve(sectionPack: SectionPack<SN>): void {
    this.prepper.loadSelfSectionPack(sectionPack);
    this.solve();
  }
  addChildAndSolve<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<SN, CN>
  ): void {
    this.prepper.addChild(childName, options);
    this.solve();
  }
  addAndGetChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<SN, CN>
  ): SolverSection<ChildSectionName<SN, CN>> {
    this.addChildAndSolve(childName, options);
    return this.solverSection(this.get.youngestChild(childName).feInfo);
  }
  loadChildAndSolve<CN extends ChildName<SN>>(
    childPackInfo: ChildPackInfo<SN, CN> & LoadChildSectionPackOptions
  ): void {
    this.prepper.loadChild(childPackInfo);
    this.solve();
  }
  loadAndGetChild<CN extends ChildName<SN>>(
    childPackInfo: ChildPackInfo<SN, CN>
  ): SolverSection<ChildSectionName<SN, CN>> {
    this.loadChildAndSolve(childPackInfo);
    return this.youngestChild(childPackInfo.childName);
  }
  addChildArrsAndSolve<CN extends ChildName<SN>>(
    childPackArrs: ChildSectionPackArrs<SN, CN>
  ): void {
    this.prepper.loadChildArrs(childPackArrs);
    this.solve();
  }
  removeChildAndSolve<CN extends ChildName<SN>>(
    childInfo: FeChildInfo<SN, CN>
  ): void {
    this.prepper.removeChild(childInfo);
    this.solve();
  }
  resetToDefaultAndSolve(): void {
    this.prepper.resetToDefault();
    this.solve();
  }
  replaceWithDefaultAndSolve(): void {
    this.prepper.resetToDefault();
    this.updater.newDbId();
    this.solve();
  }
  replaceChildPackArrsAndSolve<CN extends ChildName<SN>>(
    childPackArrs: ChildSectionPackArrs<SN, CN>
  ): void {
    this.prepper.replaceChildPackArrs(childPackArrs);
    this.solve();
  }
}
