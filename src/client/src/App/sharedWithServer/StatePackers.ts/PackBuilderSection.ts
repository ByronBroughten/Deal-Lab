import { SectionPackRaw } from "../SectionPack/SectionPackRaw";
import {
  ChildName,
  DescendantName,
} from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSectionBase } from "../StateGetters/Bases/GetterSectionBase";
import { GetterSections } from "../StateGetters/GetterSections";
import {
  AddChildOptions,
  AddDescendantOptions,
  DescendantList,
  UpdaterSection,
} from "../StateUpdaters/UpdaterSection";
import { Arr } from "../utils/Arr";
import { PackLoaderSection } from "./PackLoaderSection";
import { SectionPackMaker } from "./SectionPackMaker";

export class PackBuilderSection<
  SN extends SectionName
> extends GetterSectionBase<SN> {
  static initAsMain() {
    return new PackBuilderSection(UpdaterSection.initMainProps());
  }
  private getterSections = new GetterSections(this.getterSectionsProps);
  private updater = new UpdaterSection(this.getterSectionProps);
  private loader = new PackLoaderSection(this.getterSectionProps);
  private maker = new SectionPackMaker(this.getterSectionProps);

  makeSectionPack(): SectionPackRaw<SN> {
    // it should probably start with root
    return this.maker.makeSectionPack();
  }
  addAndGetDescendant<DN extends DescendantName<SN>>(
    descendantList: DescendantList<SN, DN>,
    options?: AddDescendantOptions<SN, DN>
  ): PackBuilderSection<DN> {
    this.updater.addDescendant(descendantList, options);
    const descendantName = Arr.lastOrThrow(descendantList) as DN;
    return this.newSectionBuilder(descendantName);
  }
  addAndGetChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<SN, CN>
  ): PackBuilderSection<CN> {
    this.addChild(childName, options);
    return this.newSectionBuilder(childName);
  }
  addChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<SN, CN>
  ) {
    this.updater.addChild(childName, options);
  }
  loadChild<CN extends ChildName<SN>>(childPack: SectionPackRaw<CN>) {
    this.loader.loadChildSectionPack(childPack);
  }
  private newSectionBuilder<S extends SectionName>(
    sectionName: S
  ): PackBuilderSection<S> {
    const { feInfo } = this.getterSections.list(sectionName).last;
    return new PackBuilderSection({
      ...feInfo,
      sectionsShare: this.sectionsShare,
    });
  }
}
