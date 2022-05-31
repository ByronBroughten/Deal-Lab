import { useSectionsContext } from "../../modules/useSections";
import {
  SwitchEndingKey,
  switchNames,
} from "../SectionsMeta/baseSections/switchNames";
import { FeSectionInfo, VarbInfo } from "../SectionsMeta/Info";
import { ChildName } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSection } from "../StateGetters/GetterSection";
import { GetterSections } from "../StateGetters/GetterSections";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { SolverSection } from "../StateSolvers/SolverSection";
import { AddChildOptions } from "../StateUpdaters/UpdaterSection";
import { SetterSectionBase } from "./SetterBases/SetterSectionBase";

export class SetterSection<
  SN extends SectionName
> extends SetterSectionBase<SN> {
  get = new GetterSection(this.getterSectionBase.getterSectionProps);
  allSections = new GetterSections(this.get.sectionsShare);
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
  // reset self
  // replaceSelf

  varbInfo(varbName: string): VarbInfo<SN> {
    return this.get.varb(varbName).feVarbInfo;
  }
  switchVarbInfo(
    varbNameBase: string,
    switchEnding: SwitchEndingKey
  ): VarbInfo<SN> {
    const varbNames = switchNames(varbNameBase, switchEnding);
    const switchValue = this.get.value(varbNames.switch, "string");
    const varbName = varbNames[switchValue as keyof typeof varbNames];
    return this.varbInfo(varbName);
  }
  switchVarb(
    varbNameBase: string,
    switchEnding: SwitchEndingKey
  ): GetterVarb<SN> {
    const { varbName } = this.switchVarbInfo(varbNameBase, switchEnding);
    return this.get.varb(varbName);
  }
  get feSectionInfo(): FeSectionInfo<SN> {
    return this.get.feSectionInfo;
  }
}

export function useSetterSection<SN extends SectionName = "main">(
  props?: FeSectionInfo<SN>
): SetterSection<SN> {
  const { sections, setSections } = useSectionsContext();
  return new SetterSection({
    ...(props ?? (sections.mainSectionInfo as FeSectionInfo<SN>)),
    setSections,
    sectionsShare: { sections },
  });
}
