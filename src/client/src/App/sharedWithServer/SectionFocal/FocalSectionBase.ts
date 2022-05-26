import { HasSharedSectionsProp } from "../HasInfoProps/HasSharedSectionsProp";
import { Id } from "../SectionsMeta/baseSections/id";
import { noParentInfoNext } from "../SectionsMeta/Info";
import { SectionName } from "../SectionsMeta/SectionName";
import { FeSection } from "../SectionsState/FeSection";
import { SectionList } from "../SectionsState/SectionList";
import { FeSections } from "../SectionsState/SectionsState";
import {
  GetterSection,
  GetterSectionProps,
} from "../StateGetters/GetterSection";
import { GetterSections } from "../StateGetters/GetterSections";
import { UpdaterSections } from "../StateUpdaters/UpdaterSections";

export class FocalSectionBase<
  SN extends SectionName = "main"
> extends HasSharedSectionsProp {
  readonly self: GetterSection<SN>;
  readonly getterSections: GetterSections;
  constructor(
    props: GetterSectionProps<SN> = FocalSectionBase.defaultProps() as any as GetterSectionProps<SN>
  ) {
    const { shared, ...sectionInfo } = props;
    const getters = new GetterSections(shared);
    if (!getters.hasSection(sectionInfo)) {
      throw new Error(
        "This focal section was not given sections containing its head section."
      );
    }
    super(shared);
    this.self = new GetterSection(props);
    this.getterSections = getters;
  }
  static defaultProps(): GetterSectionProps<"main"> {
    const shared = { sections: FeSections.init() };
    const getterSections = new GetterSections(shared);
    const updaterSections = new UpdaterSections(shared);

    const mainSection = FeSection.initNext({
      sectionName: "main",
      feId: Id.make(),
      parentInfo: noParentInfoNext,
    });

    // so this will just provide UpdaterList
    // All I need is UpdaterList

    updaterSections.updateList(
      getterSections.list("main").push(mainSection) as SectionList
    );
    // well, this is annoying.
    // I suppose it's fair.
    // Something shouldn't have updaterSections if its not supposed to.
    // they could be a superset of getterSections, though.

    return {
      ...mainSection.info,
      shared: updaterSections.shared,
    };
  }
}
