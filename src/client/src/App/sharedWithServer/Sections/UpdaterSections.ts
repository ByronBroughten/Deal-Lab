import { SimpleSectionName } from "../SectionsMeta/baseSections";
import { VarbValueInfo } from "../SectionsMeta/Info";
import { FeSectionI } from "../SectionsState/FeSection";
import FeVarb from "../SectionsState/FeSection/FeVarb";
import { SectionList } from "../SectionsState/SectionList";
import { FeSections, SectionsStateCore } from "../SectionsState/SectionsState";
import { GetterSections } from "./GetterSections";

export class UpdaterSections extends GetterSections {
  updateSection<SN extends SimpleSectionName>(
    nextSection: FeSectionI<SN>
  ): void {
    const { sectionName } = nextSection;
    this.updateList(this.list(sectionName).replace(nextSection));
  }
  updateList<SN extends SimpleSectionName>(nextList: SectionList<SN>): void {
    this.updateLists({
      [nextList.sectionName]: nextList,
    });
  }
  updateLists(partial: Partial<SectionsStateCore>): void {
    this.shared.sections = new FeSections({
      ...this.sections.core,
      ...partial,
    });
  }
  updateVarb(nextVarb: FeVarb): void {
    this.updateSection(this.section(nextVarb.info).updateVarb(nextVarb));
  }
  updateValueByEditor({ value, ...varbInfo }: VarbValueInfo): void {
    this.updateVarb(this.varb(varbInfo).updateValue(value));
  }
  updateValueDirectly({ value, ...varbInfo }: VarbValueInfo): void {
    const varb = this.varb(varbInfo);
    const nextVarb = varb.updateValue(value);
    this.updateVarb(nextVarb.triggerEditorUpdate());
  }
}
