import { ChildArrPack, SectionPack } from "../SectionPack/SectionPack";
import {
  ChildName,
  FeChildInfo,
} from "../SectionsMeta/childSectionsDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/childSectionsDerived/ChildSectionName";
import { FeSectionInfo } from "../SectionsMeta/Info";
import { SectionName } from "../SectionsMeta/SectionName";
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
  static initAsOmniChild<CN extends ChildName<"omniParent">>(
    childName: CN,
    options?: AddChildOptions<"omniParent", CN>
  ): PackBuilderSection<ChildSectionName<"omniParent", CN>> {
    const builder = this.initAsOmniParent();
    return builder.addAndGetChild(childName, options);
  }
  static initSectionPack<CN extends ChildName<"omniParent">>(
    childName: CN,
    options?: AddChildOptions<"omniParent", CN>
  ): SectionPack<ChildSectionName<"omniParent", CN>> {
    const section = this.initAsOmniChild(childName, options);
    return section.makeSectionPack();
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
    childName: CN
  ): PackBuilderSection<ChildSectionName<SN, CN>>[] {
    return this.get
      .childFeIds(childName)
      .map((feId) => this.child({ childName, feId }));
  }
  child<CN extends ChildName<SN>>(
    childInfo: FeChildInfo<SN, CN>
  ): PackBuilderSection<ChildSectionName<SN, CN>> {
    return this.packBuilderSection(this.get.childToFeInfo(childInfo));
  }
  makeSectionPack(): SectionPack<SN> {
    return this.maker.makeSectionPack();
  }
  // I shouldn't need to add the childName
  addAndGetChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<SN, CN>
  ): PackBuilderSection<ChildSectionName<SN, CN>> {
    this.addChild(childName, options);
    return this.youngestChild(childName);
  }
  addChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<SN, CN>
  ): void {
    this.updater.addChild(childName, options);
  }
  loadAndGetChild<
    CN extends ChildName<SN>,
    CT extends ChildSectionName<SN, CN>
  >(childPackInfo: ChildPackInfo<SN, CN, CT>): PackBuilderSection<CT> {
    this.loadChild(childPackInfo);
    return this.youngestChild(childPackInfo.childName);
  }
  loadChild<CN extends ChildName<SN>, CT extends ChildSectionName<SN, CN>>(
    childPackInfo: ChildPackInfo<SN, CN, CT>
  ): void {
    this.loader.loadChildSectionPack(childPackInfo);
  }
  loadAndGetChildren<
    CN extends ChildName<SN>,
    CT extends ChildSectionName<SN, CN>
  >({
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
  private youngestChild<
    CN extends ChildName<SN>,
    CT extends ChildSectionName<SN, CN> = ChildSectionName<SN, CN>
  >(childName: CN): PackBuilderSection<CT> {
    return this.packBuilderSection(this.get.youngestChild(childName));
  }
}
