import { HasSharedSectionsProp } from "../HasInfoProps/HasSharedSectionsProp";
import { SimpleSectionName } from "../SectionsMeta/baseSections";
import { FeSectionInfo, VarbValueInfo } from "../SectionsMeta/Info";
import { FeSectionI } from "../SectionsState/FeSection";
import FeVarb from "../SectionsState/FeSection/FeVarb";
import { FeSections, SectionsStateCore } from "../SectionsState/SectionsState";

export class UpdaterSections extends HasSharedSectionsProp {
  updateLists(partial: Partial<SectionsStateCore>): void {
    this.shared.sections = new FeSections({
      ...this.sections.core,
      ...partial,
    });
  }
  section<SN extends SectionName>(feInfo: FeSectionInfo<SN>): UpdaterSection<SN> {

    getByFeId(feId: string): GetterSection<SN> {
    
    }

  }
  

  // updateProps, would have access to updateList replace
  updateSection<SN extends SimpleSectionName>(
    nextSection: FeSectionI<SN>
  ): void {
    const { sectionName } = nextSection;
    this.updateList(this.sections.list(sectionName).replace(nextSection));
  }
  
  // update value by editor, would have access to updaterSection updateProps
  updateVarb(nextVarb: FeVarb): void {
    this.updateSection(
      this.sections.section(nextVarb.info).updateVarb(nextVarb)
    );
  }
  updateValueByEditor({ value, ...varbInfo }: VarbValueInfo): void {
    this.updateVarb(this.sections.varb(varbInfo).updateValue(value));
  }
  updateValueDirectly({ value, ...varbInfo }: VarbValueInfo): void {
    const varb = this.sections.varb(varbInfo);
    const nextVarb = varb.updateValue(value);
    this.updateVarb(nextVarb.triggerEditorUpdate());
  }
}
