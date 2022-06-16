import { pick } from "lodash";
import { SectionOption } from "../Analyzer/methods/get/variableOptions";
import { VarbValues } from "../Analyzer/StateSection/methods/varbs";
import { SectionPackRaw } from "../SectionPack/SectionPackRaw";
import { SwitchEndingKey } from "../SectionsMeta/baseSections/switchNames";
import { FeSectionInfo, VarbInfo } from "../SectionsMeta/Info";
import { ChildName } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { ParentNameSafe } from "../SectionsMeta/relSectionTypes/ParentTypes";
import { SectionMeta } from "../SectionsMeta/SectionMeta";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSection } from "../StateGetters/GetterSection";
import { GetterSections } from "../StateGetters/GetterSections";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { ChildSectionPackArrs } from "../StatePackers.ts/PackLoaderSection";
import { SolverSection } from "../StateSolvers/SolverSection";
import { AddChildOptions } from "../StateUpdaters/UpdaterSection";
import { SetterSectionBase } from "./SetterBases/SetterSectionBase";
import { SetterSections } from "./SetterSections";
import { SetterVarb } from "./SetterVarb";

export class SetterSection<
  SN extends SectionName
> extends SetterSectionBase<SN> {
  get = new GetterSection(this.getterSectionBase.getterSectionProps);
  allSections = new GetterSections(this.getterSectionBase.getterSectionsProps);
  private solver = SolverSection.init(
    this.getterSectionBase.getterSectionProps
  );
  get meta(): SectionMeta<"fe", SN> {
    return this.get.meta;
  }
  get sections(): SetterSections {
    return new SetterSections(this.setterSectionsProps);
  }
  setterSection<S extends SectionName>(
    feInfo: FeSectionInfo<S>
  ): SetterSection<S> {
    return new SetterSection({
      ...this.setterSectionsProps,
      ...feInfo,
    });
  }
  childFeIds(childName: ChildName<SN>): string[] {
    return this.get.childFeIds(childName);
  }
  oneChildFeId(childName: ChildName<SN>): string {
    const ids = this.childFeIds(childName);
    if (ids.length !== 1) {
      throw new Error(
        `Here, section "${this.get.sectionName}" should have exactly one of this child, "${childName}, but has ${ids.length}".`
      );
    }
    return ids[0];
  }
  get parent(): SetterSection<ParentNameSafe<SN>> {
    return new SetterSection({
      ...this.setterSectionProps,
      ...this.get.parentInfoSafe,
    });
  }
  child<CN extends ChildName<SN>>(
    feInfo: FeSectionInfo<CN>
  ): SetterSection<CN> {
    return this.setterSection(feInfo);
  }
  loadSelfSectionPack(sectionPack: SectionPackRaw<SN>): void {
    this.solver.loadSelfSectionPackAndSolve(sectionPack);
    this.setSections();
  }
  updateValues(values: VarbValues): void {
    this.solver.updateValuesAndSolve(values);
    this.setSections();
  }
  addChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<CN>
  ): void {
    this.solver.addChildAndSolve(childName, options);
    this.setSections();
  }
  addAndGetChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<CN>
  ): SetterSection<CN> {
    this.addChild(childName, options);
    const { feInfo } = this.get.youngestChild(childName);
    return this.setterSection(feInfo);
  }
  removeChild<CN extends ChildName<SN>>(feInfo: FeSectionInfo<CN>): void {
    this.solver.removeChildAndSolve(feInfo);
    this.setSections();
  }
  removeChildren(childName: ChildName<SN>): void {
    this.solver.removeChildrenAndSolve(childName);
    this.setSections();
  }
  loadChildPackArrs(childPackArrs: Partial<ChildSectionPackArrs<SN>>): void {
    this.solver.loadChildPackArrsAndSolve(childPackArrs);
    this.setSections();
  }
  removeSelf(): void {
    this.solver.removeSelfAndSolve();
    this.setSections();
  }
  replaceWithDefault(): void {
    this.solver.replaceWithDefaultAndSolve();
    this.setSections();
  }
  resetToDefault(): void {
    this.solver.resetToDefaultAndSolve();
    this.setSections();
  }
  varb(varbName: string): SetterVarb<SN> {
    return new SetterVarb({
      ...this.setterSectionProps,
      varbName,
    });
  }
  varbInfo(varbName: string): VarbInfo<SN> {
    return this.get.varbInfo(varbName);
  }
  switchVarbInfo(
    varbNameBase: string,
    switchEnding: SwitchEndingKey
  ): VarbInfo<SN> {
    return this.get.switchVarbInfo(varbNameBase, switchEnding);
  }
  switchVarb(
    varbNameBase: string,
    switchEnding: SwitchEndingKey
  ): GetterVarb<SN> {
    return this.get.switchVarb(varbNameBase, switchEnding);
  }
  get feSectionInfo(): FeSectionInfo<SN> {
    return this.get.feSectionInfo;
  }
  get feInfo(): FeSectionInfo<SN> {
    return this.get.feInfo;
  }
  get siblingOptions(): SectionOption[] {
    return this.get.siblings.map(
      (sibling) => pick(sibling, ["dbId", "displayName"]) as SectionOption
    );
  }
}
