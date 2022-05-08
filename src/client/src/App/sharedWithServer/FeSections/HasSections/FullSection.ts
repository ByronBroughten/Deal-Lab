import { applyMixins } from "../../../utils/classObjects";
import { Id } from "../../SectionMetas/baseSections/id";
import { FeSectionInfo } from "../../SectionMetas/Info";
import { ChildName } from "../../SectionMetas/relSectionTypes/ChildTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import FeSection from "../FeSection";
import { SectionInfoClass, SectionInfoGetters } from "../SectionInfoClass";
import { SectionList } from "../SectionList";
import { DescendantAdder } from "./DescendantAdder";
import { SectionPackMaker } from "./SectionPackMaker";
import { FeSections, HasSections } from "./Sections";

interface Props<SN extends SectionName>
  extends HasSections,
    FeSectionInfo<SN> {}

export class HasFullSectionProps<
  SN extends SectionName = "main"
> extends SectionInfoClass<SN> {
  readonly core: HasSections;
  constructor(
    { sections, ...sectionInfo }: Props<SN> = {
      sections: FeSections.init(),
      sectionName: "main",
      feId: Id.make(),
    }
  ) {
    super(sectionInfo);
    this.core = { sections };
  }
}

export class SectionGetter<
  SN extends SectionName
> extends HasFullSectionProps<SN> {
  protected get sections(): FeSections {
    return this.core.sections;
  }
  protected set sections(sections: FeSections) {
    this.core.sections = sections;
  }
  protected get selfSection(): FeSection<SN> {
    return this.sections.one(this.feInfo);
  }
  protected childList<CN extends ChildName<SN>>(
    childName: CN
  ): SectionList<CN> {
    return this.sectionList(childName);
  }
  protected sectionList<S extends SectionName>(sectionName: S) {
    return this.sections.list(sectionName);
  }
}
export interface SectionGetter<SN extends SectionName>
  extends SectionInfoGetters<SN> {}
applyMixins(SectionGetter, [SectionInfoGetters]);

export class SectionsUpdater<
  SN extends SectionName
> extends HasFullSectionProps<SN> {
  protected updateSelfSection(nextSelf: FeSection<SN>): void {
    this.core.sections = this.core.sections.updateSection(nextSelf as any);
  }
}
export interface SectionsUpdater<SN extends SectionName>
  extends SectionGetter<SN> {}
applyMixins(SectionsUpdater, [SectionGetter]);

export class FullSection<
  SN extends SectionName
> extends HasFullSectionProps<SN> {
  protected get selfSection(): FeSection<SN> {
    return this.sections.one(this.feInfo);
  }
  protected fullSection<IN extends SectionName>(
    info: FeSectionInfo<IN>
  ): FullSection<IN> {
    return new FullSection({
      sections: this.sections,
      ...info,
    });
  }
  lastChild<CN extends ChildName<SN>>(childName: CN): FullSection<CN> {
    return this.child(this.childList(childName).last.info);
  }
  child<CN extends ChildName<SN>>(
    childInfo: FeSectionInfo<CN>
  ): FullSection<CN> {
    return this.fullSection(childInfo);
  }
}

export interface FullSection<SN extends SectionName>
  extends SectionInfoGetters<SN>,
    SectionPackMaker<SN>,
    SectionsUpdater<SN>,
    DescendantAdder<SN> {}

applyMixins(FullSection, [
  SectionInfoGetters,
  SectionPackMaker,
  SectionsUpdater,
  DescendantAdder,
]);
