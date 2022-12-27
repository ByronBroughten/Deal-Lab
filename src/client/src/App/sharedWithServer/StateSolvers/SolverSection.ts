import { VarbName } from "../SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import { SomeSectionValues } from "../SectionsMeta/baseSectionsDerived/valueMetaTypes";
import {
  ChildName,
  DbChildInfo,
  FeChildInfo,
} from "../SectionsMeta/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { VarbInfoMixedFocal } from "../SectionsMeta/sectionChildrenDerived/MixedSectionInfo";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { FeSectionInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { GetterSectionProps } from "../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../StateGetters/GetterSection";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import {
  ChildPackInfo,
  ChildSectionPackArrs,
} from "../StatePackers.ts/PackLoaderSection";
import { PackMakerSection } from "../StatePackers.ts/PackMakerSection";
import {
  AddChildOptions,
  UpdaterSection,
} from "../StateUpdaters/UpdaterSection";
import { Obj } from "../utils/Obj";
import { AddSolverSection } from "./AddSolverSection";
import { ComboSolverSection } from "./ComboSolverSection";
import { RemoveSolverSection } from "./RemoveSolverSection";
import { SolverSectionBase } from "./SolverBases/SolverSectionBase";
import {
  HasSolveShare,
  SolverSectionsBase,
} from "./SolverBases/SolverSectionsBase";
import { SolverSections } from "./SolverSections";
import { SolverVarb } from "./SolverVarb";

interface SolverSectionInitProps<SN extends SectionName>
  extends GetterSectionProps<SN>,
    Partial<HasSolveShare> {}

export class SolverSection<
  SN extends SectionName
> extends SolverSectionBase<SN> {
  static init<S extends SectionName>(
    props: SolverSectionInitProps<S>
  ): SolverSection<S> {
    return new SolverSection({
      ...props,
      solveShare: SolverSectionsBase.initSolveShare(),
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
  private get solverSections() {
    return new SolverSections(this.solverSectionsProps);
  }
  private get updater() {
    return new UpdaterSection(this.getterSectionProps);
  }
  private get remover() {
    return RemoveSolverSection.init(this.solverSectionProps);
  }
  get adder() {
    return AddSolverSection.init(this.solverSectionProps);
  }
  private get combo() {
    return new ComboSolverSection(this.solverSectionProps);
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
  solve() {
    this.solverSections.solve();
  }
  updateValuesAndSolve(values: SomeSectionValues<SN>): void {
    this.updater.updateValues(values);
    const varbNames = Obj.keys(values) as VarbName<SN>[];
    const varbInfos = varbNames.map((varbName) => this.get.varbInfo(varbName));

    this.addVarbInfosToSolveFor(...varbInfos);
    this.solve();
  }
  private removeSelf(): void {
    this.remover.removeSelfAndExtractVarbIds();
  }
  removeSelfAndSolve(): void {
    this.removeSelf();
    this.solve();
  }
  removeChildrenAndSolve(childName: ChildName<SN>): void {
    this.remover.removeChildrenAndExtractVarbIds(childName);
    this.solve();
  }
  removeChildArrsAndSolve<CN extends ChildName<SN>>(childArrs: CN[]): void {
    for (const childName of childArrs) {
      this.remover.removeChildrenAndExtractVarbIds(childName);
      this.solve();
    }
  }
  childByDbId<CN extends ChildName<SN>>(dbInfo: DbChildInfo<SN, CN>) {
    const { childName } = dbInfo;
    const { feId } = this.get.childByDbId(dbInfo);
    return this.child({
      childName,
      feId,
    });
  }
  removeChildByDbId<CN extends ChildName<SN>>(dbInfo: DbChildInfo<SN, CN>) {
    this.removeChildByDbId(dbInfo);
    this.solve();
  }
  private doRemoveChildByDbId<CN extends ChildName<SN>>(
    dbInfo: DbChildInfo<SN, CN>
  ): void {
    const { childName } = dbInfo;
    const { feId } = this.get.childByDbId(dbInfo);
    this.removeChild({ childName, feId });
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
  child<CN extends ChildName<SN>>(
    childInfo: FeChildInfo<SN, CN>
  ): SolverSection<ChildSectionName<SN, CN>> {
    const feInfo = this.get.childInfoToFe(childInfo);
    return this.solverSection(feInfo);
  }
  removeChild<CN extends ChildName<SN>>(childInfo: FeChildInfo<SN, CN>) {
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
  removeChildAndSolve<CN extends ChildName<SN>>(
    childInfo: FeChildInfo<SN, CN>
  ): void {
    this.removeChild(childInfo);
    this.solve();
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
  loadSelf(sectionPack: SectionPack<SN>): void {
    this.combo.loadSelfSectionPackAndExtractIds(sectionPack);
    this.solve();
  }
  addChildAndSolve<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<SN, CN>
  ): void {
    this.adder.addChildAndFinalizeAllAdds(childName, options);
    this.solve();
  }
  addAndGetChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<SN, CN>
  ): SolverSection<ChildSectionName<SN, CN>> {
    this.addChildAndSolve(childName, options);
    return this.solverSection(this.get.youngestChild(childName).feInfo);
  }
  loadChild<CN extends ChildName<SN>>(
    childPackInfo: ChildPackInfo<SN, CN>
  ): void {
    const { childName, sectionPack } = childPackInfo;
    this.updater.addChild(childName);
    const child = this.youngestChild(childName);
    child.loadSelf(sectionPack);
  }
  loadAndGetChild<CN extends ChildName<SN>>(
    childPackInfo: ChildPackInfo<SN, CN>
  ): SolverSection<ChildSectionName<SN, CN>> {
    const { childName } = childPackInfo;
    this.loadChild(childPackInfo);
    return this.youngestChild(childName);
  }
  addChildArrsAndSolve<CN extends ChildName<SN>>(
    childPackArrs: ChildSectionPackArrs<SN, CN>
  ): void {
    this.adder.loadChildArrsAndFinalize(childPackArrs);
    this.solve();
  }
  replaceChildPackArrsAndSolve<CN extends ChildName<SN>>(
    childPackArrs: ChildSectionPackArrs<SN, CN>
  ): void {
    const childNames = Obj.keys(childPackArrs);
    this.removeChildArrsAndSolve(childNames);
    this.addChildArrsAndSolve(childPackArrs);
  }
}
