import {
  ChildName,
  DbChildInfo,
  FeChildInfo,
} from "../SectionsMeta/childSectionsDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/childSectionsDerived/ChildSectionName";
import {
  ChildArrPack,
  ChildSectionPack,
} from "../SectionsMeta/childSectionsDerived/ChildSectionPack";
import { SectionPack } from "../SectionsMeta/childSectionsDerived/SectionPack";
import { FeSectionInfo } from "../SectionsMeta/Info";
import { SectionName } from "../SectionsMeta/SectionName";
import {
  SectionNameByType,
  SectionNameType,
} from "../SectionsMeta/SectionNameByType";
import { GetterSectionsBase } from "../StateGetters/Bases/GetterSectionsBase";
import { UpdaterSectionBase } from "../StateUpdaters/bases/updaterSectionBase";
import {
  AddChildOptions,
  UpdaterSection,
} from "../StateUpdaters/UpdaterSection";
import {
  ChildPackInfo,
  ChildSectionPackArrs,
  PackLoaderSection,
} from "./PackLoaderSection";
import { PackMakerSection } from "./PackMakerSection";

export class PackBuilderSections extends GetterSectionsBase {
  section<SN extends SectionName>(
    feInfo: FeSectionInfo<SN>
  ): PackBuilderSection<SN> {
    return new PackBuilderSection({
      ...this.getterSectionsProps,
      ...feInfo,
    });
  }
}

export class PackBuilderSection<
  SN extends SectionNameByType
> extends UpdaterSectionBase<SN> {
  static initAsOmniParent() {
    return new PackBuilderSection(UpdaterSection.initOmniParentProps());
  }
  static loadAsOmniChild<SN extends ChildSectionName<"omniParent">>(
    sectionPack: SectionPack<SN>
  ): PackBuilderSection<SN> {
    const builder = this.initAsOmniChild(
      sectionPack.sectionName
    ) as PackBuilderSection<SN>;
    builder.loadSelf(sectionPack);
    return builder;
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
  get sections(): PackBuilderSections {
    return new PackBuilderSections(this.getterSectionsProps);
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
  isSectionType<ST extends SectionNameType>(
    sectionTypeName: ST
  ): this is PackBuilderSection<SectionNameByType<ST>> {
    return this.get.isSectionType(sectionTypeName);
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
  onlyChild<CN extends ChildName<SN>>(
    childName: CN
  ): PackBuilderSection<ChildSectionName<SN, CN>> {
    return this.packBuilderSection(this.get.onlyChild(childName).feInfo);
  }
  makeChildPackArr<CN extends ChildName<SN>>(
    childName: CN
  ): ChildSectionPack<SN, CN>[] {
    return this.maker.makeChildSectionPackArr(childName);
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
  childByDbId<CN extends ChildName<SN>>(dbInfo: DbChildInfo<SN, CN>) {
    const { childName } = dbInfo;
    const { feId } = this.get.childByDbId(dbInfo);
    return this.child({
      childName,
      feId,
    });
  }
  removeChildByDbId<CN extends ChildName<SN>>(
    dbInfo: DbChildInfo<SN, CN>
  ): void {
    const { childName } = dbInfo;
    const { feId } = this.get.childByDbId(dbInfo);
    this.removeChild({ childName, feId });
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
  loadChildren<CN extends ChildName<SN>, CT extends ChildSectionName<SN, CN>>({
    childName,
    sectionPacks,
  }: ChildArrPack<SN, CN, CT>) {
    for (const sectionPack of sectionPacks) {
      this.loadChild({
        childName,
        sectionPack,
      });
    }
  }
  loadChildArrs(childPackArrs: Partial<ChildSectionPackArrs<SN>>): void {
    this.loader.loadChildPackArrs(childPackArrs);
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
  replaceChildren<
    CN extends ChildName<SN>,
    CT extends ChildSectionName<SN, CN>
  >(childArrPack: ChildArrPack<SN, CN, CT>) {
    this.loader.loadChildSectionPackArr(childArrPack);
  }
  loadSelf(sectionPack: SectionPack<SN>) {
    this.loader.loadSelfSectionPack(sectionPack);
  }
  removeSelf() {
    this.updater.removeSelf();
  }
  removeChild<CN extends ChildName<SN>>(childInfo: FeChildInfo<SN, CN>) {
    this.updater.removeChild(childInfo);
  }
  packBuilderSection<S extends SectionNameByType>(
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

export async function loopChildren<SN extends ChildSectionName<"omniParent">>(
  sectionPack: SectionPack<SN>
) {
  const headSection = PackBuilderSection.loadAsOmniChild(sectionPack);
  let sectionInfos: FeSectionInfo[] = [headSection.feInfo];
  while (sectionInfos.length > 0) {
    const nextInfos: FeSectionInfo[] = [];
    for (const info of sectionInfos) {
      const section = headSection.sections.section(info);
      for (const childName of section.get.childNames) {
        for (const child of section.children(childName)) {
        }
      }
    }
    sectionInfos = nextInfos;
  }
}
