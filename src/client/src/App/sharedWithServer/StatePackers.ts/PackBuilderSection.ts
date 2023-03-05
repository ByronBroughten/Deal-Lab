import {
  ChildName,
  DbChildInfo,
  FeChildInfo,
} from "../SectionsMeta/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/sectionChildrenDerived/ChildSectionName";
import {
  ChildArrPack,
  ChildSectionPack,
} from "../SectionsMeta/sectionChildrenDerived/ChildSectionPack";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { FeSectionInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import {
  SectionNameByType,
  SectionNameType,
} from "../SectionsMeta/SectionNameByType";
import { SectionValues } from "../SectionsMeta/values/StateValue";
import {
  GetterSection,
  GetterSectionRequiredProps,
} from "../StateGetters/GetterSection";
import { UpdaterSectionBase } from "../StateUpdaters/bases/updaterSectionBase";
import {
  AddChildOptions,
  UpdaterSection,
} from "../StateUpdaters/UpdaterSection";
import { PackBuilderSections } from "./PackBuilderSections";
import {
  ChildPackInfo,
  ChildSectionPackArrs,
  PackLoaderSection,
} from "./PackLoaderSection";
import { PackMakerSection, SectionPackArrs } from "./PackMakerSection";

export class PackBuilderSection<
  SN extends SectionName
> extends UpdaterSectionBase<SN> {
  static init<SN extends SectionName>(
    props: GetterSectionRequiredProps<SN>
  ): PackBuilderSection<SN> {
    return new PackBuilderSection({
      ...props,
      ...GetterSection.initProps(props),
    });
  }
  get builderSections() {
    return new PackBuilderSections(this.getterSectionsProps);
  }
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
  updateValues(values: Partial<SectionValues<SN>>): void {
    this.updater.updateValues(values);
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
  get parent() {
    return this.packBuilderSection(this.get.parent.feInfo);
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
    return this.maker.makeChildPackArr(childName);
  }
  makeChildPackArrs<CN extends ChildName<SN>>(
    ...childNames: CN[]
  ): SectionPackArrs<SN, CN> {
    return this.maker.makeChildPackArrs(childNames);
  }
  makeSectionPack(): SectionPack<SN> {
    return this.maker.makeSectionPack();
  }
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
  removeChildrenArrs<CN extends ChildName<SN>>(childNames: CN[]): void {
    this.updater.removeAllChildrenInArrs(childNames);
  }
  loadAndGetChild<CN extends ChildName<SN>>(
    childPackInfo: ChildPackInfo<SN, CN>
  ): PackBuilderSection<ChildSectionName<SN, CN>> {
    this.loadChild(childPackInfo);
    return this.youngestChild(childPackInfo.childName);
  }
  loadChild<CN extends ChildName<SN>>(
    childPackInfo: ChildPackInfo<SN, CN>
  ): void {
    this.loader.loadChildSectionPack(childPackInfo);
  }
  loadChildren<CN extends ChildName<SN>>({
    childName,
    sectionPacks,
  }: ChildArrPack<SN, CN>) {
    for (const sectionPack of sectionPacks) {
      this.loadChild({
        childName,
        sectionPack,
      });
    }
  }
  loadAndGetChildren<CN extends ChildName<SN>>({
    childName,
    sectionPacks,
  }: ChildArrPack<SN, CN>): PackBuilderSection<ChildSectionName<SN, CN>>[] {
    const children: PackBuilderSection<ChildSectionName<SN, CN>>[] = [];
    for (const sectionPack of sectionPacks) {
      const child = this.loadAndGetChild({
        childName,
        sectionPack,
      });
      children.push(child);
    }
    return children;
  }
  makeSiblingCopy() {
    const sectionPack = this.makeSectionPack();
    const child = this.parent.loadAndGetChild({
      childName: this.get.selfChildName,
      sectionPack: sectionPack as SectionPack<any>,
    });
    child.updater.newDbId();
  }
  makeAndGetSiblingCopy(): PackBuilderSection<SN> {
    this.makeSiblingCopy();
    return this.packBuilderSection(this.get.list.last.feInfo);
  }
  replaceChildArrs(childPackArrs: Partial<ChildSectionPackArrs<SN>>): void {
    this.loader.replaceChildArrs(childPackArrs);
  }
  replaceChildren<
    CN extends ChildName<SN>,
    CT extends ChildSectionName<SN, CN>
  >(childArrPack: ChildArrPack<SN, CN, CT>) {
    this.loader.replaceChildren(childArrPack);
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
      ...this.getterSectionsProps,
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
