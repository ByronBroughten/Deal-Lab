import { ChildArrPack, SectionPack } from "../SectionPack/SectionPack";
import { FeSectionInfo } from "../SectionsMeta/Info";
import {
  ChildName,
  ChildType,
} from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSections } from "../StateGetters/GetterSections";
import { UpdaterSectionBase } from "../StateUpdaters/bases/updaterSectionBase";
import {
  AddChildOptions,
  UpdaterSection,
} from "../StateUpdaters/UpdaterSection";
import { ChildPackInfo, PackLoaderSection } from "./PackLoaderSection";
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
  loadAndGetChild<CN extends ChildName<SN>, CT extends ChildType<SN, CN>>(
    childPackInfo: ChildPackInfo<SN, CN, CT>
  ): PackBuilderSection<CT> {
    this.loadChild(childPackInfo);
    const { sectionName } = childPackInfo.sectionPack;
    return this.youngestPackBuilder(sectionName);
  }
  loadChild<CN extends ChildName<SN>, CT extends ChildType<SN, CN>>(
    childPackInfo: ChildPackInfo<SN, CN, CT>
  ): void {
    this.loader.loadChildSectionPack(childPackInfo);
  }
  loadAndGetChildren<CN extends ChildName<SN>, CT extends ChildType<SN, CN>>({
    childName,
    sectionPacks,
  }: ChildArrPack<SN, CN, CT>): PackBuilderSection<CT>[] {
    const children: PackBuilderSection<CT>[] = [];
    for (const sectionPack of sectionPacks) {
      const child = this.loadAndGetChild({
        childName,
        sectionPack,
      });
      children.push(child);
    }
    return children;
  }
  loadChildren<CN extends ChildName<SN>>(childArrPack: ChildArrPack<SN, CN>) {
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
