import { Id } from "../../SectionMetas/baseSections/id";
import { FeSectionInfo, noParentFeInfo } from "../../SectionMetas/Info";
import { SectionName } from "../../SectionMetas/SectionName";
import { HasSectionInfoProps } from "../HasSectionInfoProps";
import { SectionList } from "../SectionList";
import { FeSection } from "./../FeSection";
import { FeSections } from "./Sections";

export interface FullSectionsContructorProps<SN extends SectionName>
  extends FeSectionInfo<SN> {
  shared: { sections: FeSections };
}

export class HasFullSectionProps<
  SN extends SectionName = "main"
> extends HasSectionInfoProps<SN> {
  readonly core: { sections: FeSections };
  constructor(
    {
      shared,
      ...sectionInfo
    }: FullSectionsContructorProps<SN> = HasFullSectionProps.defaultProps() as any as FullSectionsContructorProps<SN>
  ) {
    if (!shared.sections.hasOne(sectionInfo)) {
      throw new Error(
        "This full section was not given sections containing its head section."
      );
    }

    super(sectionInfo);
    this.core = shared;
  }
  static defaultProps(): FullSectionsContructorProps<"main"> {
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
