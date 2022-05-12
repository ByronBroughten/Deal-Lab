import { applyMixins } from "../../../utils/classObjects";
import { ChildName } from "../../SectionMetas/relSectionTypes/ChildTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import { FeSectionI } from "../FeSection";
import { SectionInfoGetters } from "../HasSectionInfoProps";
import { SectionList } from "../SectionList";
import { HasFullSectionProps } from "./HasFullSectionProps";
import { FeSections } from "./Sections";

export class SectionAccessor<
  SN extends SectionName
> extends HasFullSectionProps<SN> {
  protected get sections(): FeSections {
    return this.core.sections;
  }
  protected set sections(sections: FeSections) {
    this.core.sections = sections;
  }
  protected get selfSection(): FeSectionI<SN> {
    return this.sections.one(this.feInfo);
  }
  protected childList<CN extends ChildName<SN>>(
    childName: CN
  ): SectionList<CN> {
    return this.sectionList(childName);
  }
  protected sectionList<S extends SectionName>(sectionName: S): SectionList<S> {
    return this.sections.list(sectionName);
  }
  protected updateSelfSection(nextSelf: FeSectionI<SN>): void {
    this.core.sections = this.core.sections.updateSection(nextSelf as any);
  }
}
export interface SectionAccessor<SN extends SectionName>
  extends SectionInfoGetters<SN> {}

applyMixins(SectionAccessor, [SectionInfoGetters]);
