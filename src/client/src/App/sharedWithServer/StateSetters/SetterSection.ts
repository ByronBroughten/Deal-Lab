import { pick } from "lodash";
import { SectionOption } from "../Analyzer/methods/get/variableOptions";
import { SwitchEndingKey } from "../SectionsMeta/baseSections/switchNames";
import { FeSectionInfo, VarbInfo } from "../SectionsMeta/Info";
import { ChildName } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { ParentNameSafe } from "../SectionsMeta/relSectionTypes/ParentTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSection } from "../StateGetters/GetterSection";
import { GetterSections } from "../StateGetters/GetterSections";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { SolverSection } from "../StateSolvers/SolverSection";
import { AddChildOptions } from "../StateUpdaters/UpdaterSection";
import { SetterSectionBase } from "./SetterBases/SetterSectionBase";
import { SetterVarb } from "./SetterVarb";

export class SetterSection<
  SN extends SectionName
> extends SetterSectionBase<SN> {
  get = new GetterSection(this.getterSectionBase.getterSectionProps);
  allSections = new GetterSections(this.getterSectionBase.getterSectionsProps);
  private solver = SolverSection.init(
    this.getterSectionBase.getterSectionProps
  );
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
  addChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<CN>
  ): void {
    this.solver.addChildAndSolve(childName, options);
    this.setSections();
  }
  removeSelf(): void {
    this.solver.removeSelfAndSolve();
    this.setSections();
  }
  resetSelf(): void {
    this.solver.resetSelfAndSolve();
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
  get siblingOptions(): SectionOption[] {
    return this.get.siblings.map(
      (sibling) => pick(sibling, ["dbId", "displayName"]) as SectionOption
    );
  }
}
