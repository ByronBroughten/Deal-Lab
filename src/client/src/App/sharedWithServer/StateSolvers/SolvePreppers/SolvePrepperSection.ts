import { makeEmptyMain } from "../../defaultMaker/makeEmptyMain";
import { VarbName } from "../../SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import {
  ChildName,
  DbChildInfo,
  FeChildInfo,
} from "../../SectionsMeta/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../../SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { ChildArrPack } from "../../SectionsMeta/sectionChildrenDerived/ChildSectionPack";
import { ParentNameSafe } from "../../SectionsMeta/sectionChildrenDerived/ParentName";
import { SectionPack } from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
import { FeSectionInfo } from "../../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../../SectionsMeta/SectionName";
import { SectionValues } from "../../SectionsMeta/values/StateValue";
import { GetterSection } from "../../StateGetters/GetterSection";
import { OutVarbGetterSection } from "../../StateInOutVarbs/OutVarbGetterSection";
import { ChildSectionPackArrs } from "../../StatePackers/ChildPackProps";
import { AddChildWithPackOptions } from "../../StatePackers/PackBuilderSection";
import { SolveState } from "../../StateSections/SolveState";
import { StateSections } from "../../StateSections/StateSections";
import { DefaultUpdaterSection } from "../../StateUpdaters/DefaultUpdaterSection";
import {
  AddChildOptions,
  UpdaterSection,
} from "../../StateUpdaters/UpdaterSection";
import { Obj } from "../../utils/Obj";
import { GetterSectionProps } from "./../../StateGetters/Bases/GetterSectionBase";
import { EntityPrepperSection } from "./../EntityPreppers/EntityPrepperSection";
import { SolvePrepper } from "./SolvePrepper";
import { SolvePrepperSectionBase } from "./SolvePrepperBases/SolvePrepperSectionBase";

export class SolvePrepperSection<
  SN extends SectionName
> extends SolvePrepperSectionBase<SN> {
  private get solvePrepper(): SolvePrepper {
    return new SolvePrepper(this.solverProps);
  }
  get prepper(): SolvePrepper {
    return this.solvePrepper;
  }
  get get(): GetterSection<SN> {
    return new GetterSection(this.getterSectionProps);
  }
  private get inOut(): OutVarbGetterSection<SN> {
    return new OutVarbGetterSection(this.getterSectionProps);
  }
  private get entity(): EntityPrepperSection<SN> {
    return new EntityPrepperSection(this.getterSectionProps);
  }
  private get defaultUpdater() {
    return new DefaultUpdaterSection(this.getterSectionProps);
  }
  get updater(): UpdaterSection<SN> {
    return new UpdaterSection(this.getterSectionProps);
  }
  isOfSectionName<S extends SectionName>(
    ...sectionNames: S[]
  ): this is SolvePrepperSection<S> {
    return this.get.isOfSectionName(...sectionNames);
  }
  get parent(): SolvePrepperSection<ParentNameSafe<SN>> {
    const { parentInfoSafe } = this.get;
    return this.prepperSection(parentInfoSafe);
  }
  private prepperSection<S extends SectionName>(
    info: FeSectionInfo<S>
  ): SolvePrepperSection<S> {
    return new SolvePrepperSection({
      ...this.solverProps,
      ...info,
    });
  }
  child<CN extends ChildName<SN>>(
    childInfo: FeChildInfo<SN, CN>
  ): SolvePrepperSection<ChildSectionName<SN, CN>> {
    const feInfo = this.get.childInfoToFe(childInfo);
    return this.prepperSection(feInfo);
  }
  childByDbId<CN extends ChildName<SN>>(
    dbInfo: DbChildInfo<SN, CN>
  ): SolvePrepperSection<ChildSectionName<SN, CN>> {
    const { feId } = this.get.childByDbId(dbInfo);
    return this.child({
      childName: dbInfo.childName,
      feId,
    });
  }
  onlyChild<CN extends ChildName<SN>>(
    childName: CN
  ): SolvePrepperSection<ChildSectionName<SN, CN>> {
    const { feInfo } = this.get.onlyChild(childName);
    return this.prepperSection(feInfo);
  }
  children<CN extends ChildName<SN>>(
    childName: CN
  ): SolvePrepperSection<ChildSectionName<SN, CN>>[] {
    const getters = this.get.children(childName);
    return getters.map(({ feInfo }) => this.prepperSection(feInfo));
  }
  youngestChild<CN extends ChildName<SN>>(
    childName: CN
  ): SolvePrepperSection<ChildSectionName<SN, CN>> {
    const { feInfo } = this.get.youngestChild(childName);
    return this.prepperSection(feInfo);
  }
  removeSelf() {
    this.prepForRemoveSelf();
    this.defaultUpdater.removeSelf();
  }
  prepForRemoveSelf() {
    const { selfAndDescendantActiveOutVarbIds } = this.inOut;
    this.addVarbIdsToSolveFor(...selfAndDescendantActiveOutVarbIds);

    const { selfAndDescendantVarbIds } = this.get;
    this.removeVarbIdsToSolveFor(...selfAndDescendantVarbIds);
    this.entity.removeOutEntitiesOfAllInEntities(
      this.throwIfEntityToRemoveMissing
    );
  }
  removeChild<CN extends ChildName<SN>>(childInfo: FeChildInfo<SN, CN>): void {
    if (this.get.hasChild(childInfo)) {
      const child = this.child(childInfo);
      child.removeSelf();
    } else {
      const { childName, feId } = childInfo;
      throw new Error(
        `Section ${this.get.sectionName}.${this.get.feId} does not have child ${childName}.${feId}.`
      );
    }
  }
  removeChildByDbId<CN extends ChildName<SN>>(dbInfo: DbChildInfo<SN, CN>) {
    const child = this.get.childByDbId(dbInfo);
    this.removeChild({
      childName: dbInfo.childName,
      feId: child.feId,
    });
  }
  removeChildren(childName: ChildName<SN>): void {
    const childFeIds = this.get.childFeIds(childName);
    for (const feId of childFeIds) {
      this.removeChild({ childName, feId });
    }
  }
  removeChildArrs<CN extends ChildName<SN>>(childArrs: CN[]): void {
    for (const childName of childArrs) {
      this.removeChildren(childName);
    }
  }
  addChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildWithPackOptions<SN, CN>
  ) {
    this.defaultUpdater.addChild(childName, options);
    this.finalizeNewChild(childName);
  }
  addAndGetChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildWithPackOptions<SN, CN>
  ): SolvePrepperSection<ChildSectionName<SN, CN>> {
    this.addChild(childName, options);
    return this.youngestChild(childName);
  }
  loadChildren<CN extends ChildName<SN>>({
    childName,
    sectionPacks,
  }: ChildArrPack<SN, CN>): void {
    for (const sectionPack of sectionPacks) {
      this.addChild(childName, { sectionPack });
    }
  }
  loadChildArrs<CN extends ChildName<SN>>(
    packArrs: ChildSectionPackArrs<SN, CN>
  ): void {
    for (const childName of Obj.keys(packArrs)) {
      this.loadChildren({
        childName,
        sectionPacks: packArrs[childName],
      });
    }
  }
  private finalizeNewChild<CN extends ChildName<SN>>(childName: CN) {
    const child = this.youngestChild(childName);
    child.finalizeAddedThis();
  }
  private finalizeAddedThis() {
    const { selfAndDescendantVarbIds } = this.get;
    this.addVarbIdsToSolveFor(...selfAndDescendantVarbIds);
    this.updateVariablesIfNeeded();
    this.doUpdateOutvarbsOnSolve();

    // temporary fix
    this.doNotThrowIfEntityToRemoveMissing();
  }
  private updateVariablesIfNeeded() {
    const { sectionName, feId } = this.get;
    if (sectionName === "dealSystem") {
      this.solvePrepper.applyVariablesToDealSystem(feId);
    }
  }
  loadSelfSectionPack(sectionPack: SectionPack<SN>): void {
    this.prepForRemoveSelf();
    this.defaultUpdater.loadSelfSectionPack(sectionPack);
    this.finalizeAddedThis();
  }
  resetToDefault(): void {
    const { feInfo, feId, idx, dbId } = this.get;
    const { parent } = this;
    const childName = parent.get.sectionChildName(feInfo);
    this.removeSelf();
    parent.addChild(childName, { feId, idx, dbId });
  }
  replaceChildPackArrs<CN extends ChildName<SN>>(
    childPackArrs: ChildSectionPackArrs<SN, CN>
  ): void {
    const childNames = Obj.keys(childPackArrs);
    this.removeChildArrs(childNames);
    this.loadChildArrs(childPackArrs);
  }
  updateValues(values: Partial<SectionValues<SN>>): void {
    const varbNames = Obj.keys(values);

    // Temporary fix
    this.doNotThrowIfEntityToRemoveMissing();

    this.entity.removeOutEntitiesOfVarbNameInEntities(
      varbNames,
      this.throwIfEntityToRemoveMissing
    );

    this.defaultUpdater.updateValues(values);
    this.addValueIdsToSolveFor(varbNames);
    this.doUpdateOutvarbsOnSolve();
  }
  private addValueIdsToSolveFor(varbNames: VarbName<SN>[]): void {
    const varbIds = varbNames.map((varbName) => this.get.varb(varbName).varbId);
    this.addVarbIdsToSolveFor(...varbIds);
  }
  static init<SN extends SectionName>(
    props: GetterSectionProps<SN>
  ): SolvePrepperSection<SN> {
    const section = new SolvePrepperSection({
      ...props,
      solveShare: { solveState: SolveState.initEmpty() },
    });
    section.doNotThrowIfEntityToRemoveMissing();
    return section;
  }
  static initFromPackAsOmniChild<SN extends ChildName<"omniParent">>(
    sectionPack: SectionPack<SN>
  ): SolvePrepperSection<SN> {
    const adder = DefaultUpdaterSection.loadAsOmniChild(sectionPack);
    return SolvePrepperSection.init(adder.getterSectionProps);
  }
  static initAsOmniParent() {
    return SolvePrepperSection.init(UpdaterSection.initOmniParentProps());
  }

  static initAsOmniChild<SN extends ChildName<"omniParent">>(
    sectionName: SN,
    options?: AddChildOptions<"omniParent", SN>
  ): SolvePrepperSection<ChildSectionName<"omniParent", SN>> {
    const solver = this.initAsOmniParent();
    return solver.addAndGetChild(sectionName, options);
  }
  static initRoot(): SolvePrepperSection<"root"> {
    const sections = StateSections.initWithRoot();
    const rootRaw = sections.rawSectionList("root")[0];
    return SolvePrepperSection.init({
      sectionName: "root",
      feId: rootRaw.feId,
      sectionsShare: { sections },
    });
  }
  static initMainFromPack(
    sectionPack: SectionPack<"main">
  ): SolvePrepperSection<"main"> {
    const root = SolvePrepperSection.initRoot();
    return root.addAndGetChild("main", { sectionPack });
  }
  static initEmptyMain() {
    return this.initMainFromPack(makeEmptyMain());
  }
}
