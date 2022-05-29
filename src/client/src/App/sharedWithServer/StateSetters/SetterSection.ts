import { useSectionsContext } from "../../modules/useSections";
import { ChildName } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSectionProps } from "../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../StateGetters/GetterSection";
import { SolverSection } from "../StateSolvers/SolverSection";
import { StrictOmit } from "../utils/types";
import { SetterSectionBase } from "./SetterBases/SetterSectionBase";

export class SetterSection<
  SN extends SectionName
> extends SetterSectionBase<SN> {
  private getterSection = new GetterSection(
    this.getterSectionBase.getterSectionProps
  );
  private solver = SolverSection.init(
    this.getterSectionBase.getterSectionProps
  );
  childFeIds(childName: ChildName<SN>): string[] {
    return this.getterSection.childFeIds(childName);
  }
  addChild(childName: ChildName<SN>) {
    this.solver.addChildAndSolve(childName);
    this.setSections();
  }
  updateValueByEditor() {}
  // updateValueByEditor
  // removeSelf
  // replaceSelf
}

interface UseSetterSectionProps<SN extends SectionName>
  extends StrictOmit<GetterSectionProps<SN>, "sectionsShare"> {}

export function useSetterSection<SN extends SectionName>(
  props: UseSetterSectionProps<SN>
): SetterSection<SN> {
  const { sections, setSections } = useSectionsContext();
  return new SetterSection({
    ...props,
    setSections,
    sectionsShare: { sections },
  });
}
