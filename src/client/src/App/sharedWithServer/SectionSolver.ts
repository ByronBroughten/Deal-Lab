import { AddChildOptions } from "./FeSections/HasSections/DescendantAdder";
import { FullSection } from "./FeSections/HasSections/FullSection";
import { FeSections } from "./FeSections/HasSections/Sections";
import { FeSectionInfo } from "./SectionMetas/Info";
import { ChildName } from "./SectionMetas/relSectionTypes/ChildTypes";
import { SectionName } from "./SectionMetas/SectionName";

interface SectionSolverConstructorProps<SN extends SectionName>
  extends FeSectionInfo<SN> {
  sections: FeSections;
}

export class SectionSolver<SN extends SectionName> {
  builder: FullSection<SN>;
  varbFullNamesToSolveFor: Set<string>;
  constructor({ sections, ...info }: SectionSolverConstructorProps<SN>) {
    this.builder = new FullSection({ shared: { sections }, ...info });
    this.varbFullNamesToSolveFor = new Set();
  }

  addChildAndSolve(childName: ChildName<SN>, options?: AddChildOptions<SN>) {
    // am I adding any children with this?
    // I will if I add from a default section, which I should.
    this.builder.addChild(childName, options);
  }
}
