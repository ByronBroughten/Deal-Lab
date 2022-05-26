import { SetSections, useSectionsContext } from "../../modules/useSections";
import { FeSectionInfo } from "../SectionsMeta/Info";
import { ChildName } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSectionProps } from "../StateGetters/GetterSection";
import { StrictOmit } from "../utils/types";
import { FocalSectionBase } from "./FocalSectionBase";
import { SectionSolver } from "./SectionSolver";

interface Props<SN extends SectionName> extends GetterSectionProps<SN> {
  setSections: SetSections;
}

export class SectionSetter<
  SN extends SectionName
> extends FocalSectionBase<SN> {
  private setSections: () => void;
  constructor({ setSections, ...rest }: Props<SN>) {
    super(rest);
    this.setSections = () => setSections(() => this.shared.sections);
  }
  private solver = SectionSolver.init(this.self.constructorProps);
  get feInfo(): FeSectionInfo<SN> {
    return this.self.feInfo;
  }
  childFeIds(childName: ChildName<SN>): string[] {
    return this.self.childFeIds(childName);
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

interface UseSectionSetterProps<SN extends SectionName>
  extends StrictOmit<GetterSectionProps<SN>, "shared"> {}

export function useSectionSetter<SN extends SectionName>(
  props: UseSectionSetterProps<SN>
): SectionSetter<SN> {
  const { sections, setSections } = useSectionsContext();
  return new SectionSetter({
    ...props,
    setSections,
    shared: {
      sections,
    },
  });
}
