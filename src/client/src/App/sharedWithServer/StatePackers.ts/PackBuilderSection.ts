import { SectionArrPack, SectionPack } from "../SectionPack/SectionPack";
import { FeSectionInfo } from "../SectionsMeta/Info";
import {
  ChildName,
  DescendantName,
} from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSections } from "../StateGetters/GetterSections";
import { UpdaterSectionBase } from "../StateUpdaters/bases/updaterSectionBase";
import {
  AddChildOptions,
  AddDescendantOptions,
  DescendantList,
  UpdaterSection,
} from "../StateUpdaters/UpdaterSection";
import { Arr } from "../utils/Arr";
import { PackLoaderSection } from "./PackLoaderSection";
import { PackMakerSection } from "./PackMakerSection";

export class PackBuilderSection<
  SN extends SectionName
> extends UpdaterSectionBase<SN> {
  static initAsOmniParent() {
    return new PackBuilderSection(UpdaterSection.initOmniParentProps());
  }
  static initAsMain() {
    return new PackBuilderSection(UpdaterSection.initMainProps());
  }
  static initAsRoot() {
    return new PackBuilderSection(UpdaterSection.initRootProps());
  }
  static initAsOmniChild<SN extends SectionName<"notRootNorOmni">>(
    sectionName: SN,
    options?: AddChildOptions<SN>
  ): PackBuilderSection<SN> {
    const builder = this.initAsOmniParent();
    return builder.addAndGetChild(sectionName, options);
  }
  static initSectionPack<SN extends SectionName<"notRootNorOmni">>(
    sectionName: SN,
    options?: AddChildOptions<SN>
  ): SectionPack<SN> {
    const section = this.initAsOmniChild(sectionName, options);
    return section.makeSectionPack();
  }
  private get getterSections() {
    return new GetterSections(this.getterSectionsProps);
  }
  get updater(): UpdaterSection<SN> {
    return new UpdaterSection(this.getterSectionProps);
  }
  get loader(): PackLoaderSection<SN> {
    return new PackLoaderSection(this.getterSectionProps);
  }
  get maker(): PackMakerSection<SN> {
    return new PackMakerSection(this.getterSectionProps);
  }
  children<CN extends ChildName<SN>>(
    sectionName: CN
  ): PackBuilderSection<CN>[] {
    return this.get.childFeIds(sectionName).map((feId) =>
      this.packBuilderSection({
        sectionName,
        feId,
      })
    );
  }
  makeSectionPack(): SectionPack<SN> {
    // it should probably start with root
    return this.maker.makeSectionPack();
  }
  addAndGetDescendant<DN extends DescendantName<SN>>(
    descendantList: DescendantList<SN, DN>,
    options?: AddDescendantOptions<SN, DN>
  ): PackBuilderSection<DN> {
    this.updater.addDescendant(descendantList, options);
    const descendantName = Arr.lastOrThrow(descendantList) as DN;
    return this.youngestPackBuilder(descendantName);
  }
  addAndGetChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<SN, CN>
  ): PackBuilderSection<CN> {
    this.addChild(childName, options);
    return this.youngestPackBuilder(childName);
  }
  addChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<SN, CN>
  ): void {
    this.updater.addChild(childName, options);
  }
  loadAndGetChild<CN extends ChildName<SN>>(
    childPack: SectionPack<CN>
  ): PackBuilderSection<CN> {
    this.loadChild(childPack);
    return this.youngestPackBuilder(childPack.sectionName);
  }
  loadChild<CN extends ChildName<SN>>(childPack: SectionPack<CN>): void {
    this.loader.loadChildSectionPack(childPack);
  }
  loadAndGetChildren<CN extends ChildName<SN>>(
    childArrPack: SectionArrPack<CN>
  ): PackBuilderSection<CN>[] {
    const children: PackBuilderSection<CN>[] = [];
    for (const pack of childArrPack.sectionPacks) {
      children.push(this.loadAndGetChild(pack));
    }
    return children;
  }
  loadChildren<CN extends ChildName<SN>>(childArrPack: SectionArrPack<CN>) {
    this.loader.loadChildSectionPackArr(childArrPack);
  }
  loadSelf(sectionPack: SectionPack<SN>) {
    this.loader.updateSelfWithSectionPack(sectionPack);
  }
  packBuilderSection<S extends SectionName>(
    feInfo: FeSectionInfo<S>
  ): PackBuilderSection<S> {
    return new PackBuilderSection({
      ...feInfo,
      sectionsShare: this.sectionsShare,
    });
  }
  private youngestPackBuilder<S extends SectionName>(
    sectionName: S
  ): PackBuilderSection<S> {
    const { feInfo } = this.getterSections.newestEntry(sectionName);
    return this.packBuilderSection(feInfo);
  }
}
