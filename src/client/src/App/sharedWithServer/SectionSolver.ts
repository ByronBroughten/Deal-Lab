import { defaultSectionPacks } from "./Analyzer/methods/internal/addSections/gatherSectionInitProps/defaultSectionPacks";
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

  private nestedVarbInfos() {}

  addChildAndSolve(childName: ChildName<SN>) {
    if (defaultSectionPacks.has(childName)) {
      const sectionPack = defaultSectionPacks.get(childName);
      // implement loading
    } else {
      this.builder.addChild(childName);
    }

    const addedChild = this.builder.lastChild(childName);
    // give FullSection "nestedVarbInfos", copy from Analyzer
    // Get the nested varb infos for the added section

    // here convert them into fullNamesToSolveFor
    // this.varbFullNamesToSolveFor.add()

    // copy this.solve() from Analyzer
  }
  loadSectionPackAndSolve() {}
}
