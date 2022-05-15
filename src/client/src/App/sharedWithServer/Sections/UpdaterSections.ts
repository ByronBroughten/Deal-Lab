import { SimpleSectionName } from "../SectionsMeta/baseSections";
import { VarbValueInfo } from "../SectionsMeta/Info";
import { FeSectionI } from "../SectionsState/FeSection";
import FeVarb from "../SectionsState/FeSection/FeVarb";
import { SectionList } from "../SectionsState/SectionList";
import { FeSections, SectionsStateCore } from "../SectionsState/SectionsState";
import { GetterSections } from "./GetterSections";

export class UpdaterSections extends GetterSections {
  updateSection(nextSection: FeSectionI<SimpleSectionName>): FeSections {
    const { sectionName } = nextSection;
    return this.updateList(this.list(sectionName).replace(nextSection));
  }
  updateList(nextList: SectionList): FeSections {
    return this.updateLists({
      [nextList.sectionName]: nextList,
    });
  }
  updateLists(partial: Partial<SectionsStateCore>): FeSections {
    return new FeSections({
      ...this.sections.core,
      ...partial,
    });
  }
  updateVarb(nextVarb: FeVarb): FeSections {
    return this.updateSection(this.section(nextVarb.info).updateVarb(nextVarb));
  }
  updateValueByEditor({ value, ...varbInfo }: VarbValueInfo): FeSections {
    return this.updateVarb(this.varb(varbInfo).updateValue(value));
  }
  updateValueDirectly({ value, ...varbInfo }: VarbValueInfo): FeSections {
    const varb = this.varb(varbInfo);
    const nextVarb = varb.updateValue(value);
    return this.updateVarb(nextVarb.triggerEditorUpdate());
  }
}
