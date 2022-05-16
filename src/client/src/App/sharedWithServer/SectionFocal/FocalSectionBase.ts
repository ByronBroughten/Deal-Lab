import { GetterSections } from "../Sections/GetterSections";
import { HasSharedSections } from "../Sections/HasSharedSections";
import { UpdaterSections } from "../Sections/UpdaterSections";
import { Id } from "../SectionsMeta/baseSections/id";
import { noParentInfoNext } from "../SectionsMeta/Info";
import { SectionName } from "../SectionsMeta/SectionName";
import { FeSection } from "../SectionsState/FeSection";
import { SectionList } from "../SectionsState/SectionList";
import { FeSections } from "../SectionsState/SectionsState";
import { SelfGetters, SelfGettersProps } from "./SelfGetters";

export class FocalSectionBase<
  SN extends SectionName = "main"
> extends HasSharedSections {
  readonly self: SelfGetters<SN>;
  constructor(
    props: SelfGettersProps<SN> = FocalSectionBase.defaultProps() as any as SelfGettersProps<SN>
  ) {
    const { shared, ...sectionInfo } = props;
    const getters = new GetterSections(shared);
    if (!getters.hasSection(sectionInfo)) {
      throw new Error(
        "This focal section was not given sections containing its head section."
      );
    }
    super(shared);
    this.self = new SelfGetters(props);
  }
  static defaultProps(): SelfGettersProps<"main"> {
    const updaterSections = new UpdaterSections({
      sections: FeSections.init(),
    });

    const mainSection = FeSection.initNext({
      sectionName: "main",
      feId: Id.make(),
      parentInfo: noParentInfoNext,
    });

    updaterSections.updateList(
      updaterSections.list("main").push(mainSection) as SectionList
    );

    return {
      ...mainSection.info,
      shared: updaterSections.shared,
    };
  }
}
