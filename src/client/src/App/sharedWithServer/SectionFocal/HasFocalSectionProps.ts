import { HasSectionInfoProps } from "../FeSections/HasSectionInfoProps";
import { SharedSections } from "../Sections/HasSharedSections";
import { Id } from "../SectionsMeta/baseSections/id";
import { FeInfoByType, noParentFeInfo } from "../SectionsMeta/Info";
import { SectionName } from "../SectionsMeta/SectionName";
import { FeSection } from "../SectionsState/FeSection";
import { SectionList } from "../SectionsState/SectionList";
import { FeSections } from "../SectionsState/SectionsState";

export interface FullSectionConstructorProps<SN extends SectionName>
  extends FeInfoByType<SN> {
  shared: SharedSections;
}

export class HasFocalSectionProps<
  SN extends SectionName = "main"
> extends HasSectionInfoProps<SN> {
  readonly shared: SharedSections;
  constructor(
    {
      shared,
      ...sectionInfo
    }: FullSectionConstructorProps<SN> = HasFocalSectionProps.defaultProps() as any as FullSectionConstructorProps<SN>
  ) {
    if (!shared.sections.hasOne(sectionInfo)) {
      throw new Error(
        "This full section was not given sections containing its head section."
      );
    }

    super(sectionInfo);
    this.shared = shared;
  }

  static defaultProps(): FullSectionConstructorProps<"main"> {
    const sectionInfo = {
      sectionName: "main",
      feId: Id.make(),
    } as const;

    const mainSection = FeSection.initNext({
      ...sectionInfo,
      parentInfo: noParentFeInfo,
    });

    const initSections = FeSections.init();
    const sections = initSections.updateList(
      initSections.list("main").push(mainSection) as SectionList
    );

    return {
      ...sectionInfo,
      shared: { sections },
    };
  }
}
