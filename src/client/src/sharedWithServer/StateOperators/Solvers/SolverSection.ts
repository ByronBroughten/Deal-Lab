import { FeSectionInfo } from "../../SectionInfos/FeInfo";
import { VarbInfoMixedFocal } from "../../SectionInfos/MixedSectionInfo";
import { SectionNameByType } from "../../SectionNameByType";
import {
  ChildPackArrs,
  ChildPackInfo,
} from "../../SectionPacks/ChildSectionPack";
import { SectionPack } from "../../SectionPacks/SectionPack";
import { VarbName } from "../../sectionVarbsConfigDerived/baseSectionsDerived/baseSectionsVarbsTypes";
import {
  ChildName,
  DbChildInfo,
  FeChildInfo,
} from "../../sectionVarbsConfigDerived/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../../sectionVarbsConfigDerived/sectionChildrenDerived/ChildSectionName";
import { StateSections } from "../../State/StateSections";
import { GetterSectionProps } from "../../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../../StateGetters/GetterSection";
import { SectionName } from "../../stateSchemas/SectionName";
import { SectionValues, VarbValue } from "../../stateSchemas/StateValue";
import { NumObjOutput } from "../../stateSchemas/StateValue/NumObj";
import { DefaultUpdaterSection } from "../DefaultUpdaters/DefaultUpdaterSection";
import {
  AddChildWithPackOptions,
  PackBuilderSection,
} from "../Packers/PackBuilderSection";
import { PackMakerSection } from "../Packers/PackMakerSection";
import { SolvePrepperSection } from "../SolvePreppers/SolvePrepperSection";
import { SolverSectionBase } from "../SolverBases/SolverSectionBase";
import {
  HasSolveShare,
  SolverSectionsBase,
} from "../SolverBases/SolverSectionsBase";
import { AddChildOptions, UpdaterSection } from "../Updaters/UpdaterSection";
import { SolverSections } from "./SolverSections";
import { SolverVarb } from "./SolverVarb";

interface SolverSectionInitProps<SN extends SectionName>
  extends GetterSectionProps<SN>,
    Partial<HasSolveShare> {}

export class SolverSection<
  SN extends SectionName
> extends SolverSectionBase<SN> {
  get solvePrepper(): SolvePrepperSection<SN> {
    return new SolvePrepperSection(this.solverSectionProps);
  }
  get prepper(): SolvePrepperSection<SN> {
    return new SolvePrepperSection(this.solverSectionProps);
  }
  get basic(): SolvePrepperSection<SN> {
    return this.solvePrepper;
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
    const adder = DefaultUpdaterSection.loadAsOmniChild(sectionPack);
    return SolverSection.init(adder.getterSectionProps);
  }
  static initAsOmniParent() {
    return SolverSection.init(UpdaterSection.initOmniParentProps());
  }

  static initAsOmniChild<SN extends ChildName<"omniParent">>(
    sectionName: SN,
    options?: AddChildOptions<"omniParent", SN>
  ): SolverSection<ChildSectionName<"omniParent", SN>> {
    const solver = this.initAsOmniParent();
    return solver.addAndGetChild(sectionName, options);
  }
  static initDefaultMain(): SolverSection<"main"> {
    const sections = SolverSections.initSectionsFromDefaultMain();
    const mainRaw = sections.firstRawSection("main");
    return this.init({
      sectionsShare: { sections },
      ...mainRaw,
    });
  }
  isOfSectionName<S extends SectionName>(
    ...sectionNames: S[]
  ): this is SolverSection<S> {
    return this.get.isOfSectionName(...sectionNames);
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
    return this.solverSections.varbIdsToSolveFor;
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
    this.solvePrepper.updateValues(values);
    this.solve();
  }
  updateValues(values: Partial<SectionValues<SN>>): void {
    this.solvePrepper.updateValues(values);
    this.solve();
  }
  removeSelfAndSolve(): void {
    this.solvePrepper.removeSelf();
    this.solve();
  }
  removeChildrenAndSolve(childName: ChildName<SN>): void {
    this.solvePrepper.removeChildren(childName);
    this.solve();
  }
  removeChildArrsAndSolve<CN extends ChildName<SN>>(childArrs: CN[]): void {
    this.solvePrepper.removeChildArrs(childArrs);
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
    this.solvePrepper.removeChildByDbId(dbInfo);
    this.solve();
  }
  value<VN extends VarbName<SN>>(varbName: VN): VarbValue<SN, VN> {
    return this.get.valueNext(varbName);
  }
  numValue<VN extends VarbName<SN>>(varbName: VN): number {
    return this.get.numValue(varbName);
  }
  numOutput<VN extends VarbName<SN>>(varbName: VN): NumObjOutput {
    return this.get.varbNext(varbName).numObjOutput;
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
    this.solvePrepper.loadSelfSectionPack(sectionPack);
    this.solve();
  }
  addChildAndSolve<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildWithPackOptions<SN, CN>
  ): void {
    this.solvePrepper.addChild(childName, options);
    this.solve();
  }
  addAndGetChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildWithPackOptions<SN, CN>
  ): SolverSection<ChildSectionName<SN, CN>> {
    this.addChildAndSolve(childName, options);
    return this.solverSection(this.get.youngestChild(childName).feInfo);
  }
  loadChildAndSolve<CN extends ChildName<SN>>({
    childName,
    ...rest
  }: { childName: CN } & AddChildWithPackOptions<SN, CN>): void {
    this.solvePrepper.addChild(childName, rest);
    this.solve();
  }
  loadAndGetChild<CN extends ChildName<SN>>(
    childPackInfo: ChildPackInfo<SN, CN>
  ): SolverSection<ChildSectionName<SN, CN>> {
    this.loadChildAndSolve(childPackInfo);
    return this.youngestChild(childPackInfo.childName);
  }
  addChildArrsAndSolve<CN extends ChildName<SN>>(
    childPackArrs: ChildPackArrs<SN, CN>
  ): void {
    this.solvePrepper.loadChildArrs(childPackArrs);
    this.solve();
  }
  removeChildAndSolve<CN extends ChildName<SN>>(
    childInfo: FeChildInfo<SN, CN>
  ): void {
    this.solvePrepper.removeChild(childInfo);
    this.solve();
  }
  resetToDefaultAndSolve(): void {
    this.solvePrepper.resetToDefault();
    this.solve();
  }
  replaceWithDefaultAndSolve(): void {
    this.solvePrepper.resetToDefault();
    this.updater.newDbId();
    this.solve();
  }
  replaceChildPackArrsAndSolve<CN extends ChildName<SN>>(
    childPackArrs: ChildPackArrs<SN, CN>
  ): void {
    this.solvePrepper.replaceChildPackArrs(childPackArrs);
    this.solve();
  }
}
