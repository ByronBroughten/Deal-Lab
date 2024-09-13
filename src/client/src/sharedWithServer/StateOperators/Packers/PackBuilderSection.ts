import { GetterSectionBase } from "../../StateGetters/Bases/GetterSectionBase";
import {
  GetterSection,
  GetterSectionRequiredProps,
} from "../../StateGetters/GetterSection";
import { FeSectionInfo } from "../../StateGetters/Identifiers/FeInfo";
import { PackMakerSection } from "../../StateGetters/PackMakerSection";
import {
  ChildName,
  DbChildInfo,
  FeChildInfo,
} from "../../stateSchemas/fromSchema6SectionChildren/ChildName";
import { ChildSectionName } from "../../stateSchemas/fromSchema6SectionChildren/ChildSectionName";
import { SectionName } from "../../stateSchemas/schema2SectionNames";
import { SectionValues } from "../../stateSchemas/schema4ValueTraits/StateValue";
import {
  SectionNameByType,
  SectionNameType,
} from "../../stateSchemas/schema6SectionChildren/SectionNameByType";
import {
  ChildArrPack,
  ChildPackArrs,
  ChildSectionPack,
} from "../../StateTransports/ChildSectionPack";
import { SectionPack } from "../../StateTransports/SectionPack";
import { Obj } from "../../utils/Obj";
import { AddChildOptions, UpdaterSection } from "../Updaters/UpdaterSection";
import { PackBuilderSections } from "./PackBuilderSections";
import { SelfPackLoader } from "./SelfPackLoader";

export interface AddChildWithPackOptions<
  SN extends SectionName,
  CN extends ChildName<SN> = ChildName<SN>,
  CSN extends ChildSectionName<SN, CN> = ChildSectionName<SN, CN>
> extends AddChildOptions<SN, CN, CSN> {
  sectionPack?: SectionPack<CSN>;
}

export class PackBuilderSection<
  SN extends SectionName
> extends GetterSectionBase<SN> {
  static init<SN extends SectionName>(
    props: GetterSectionRequiredProps<SN>
  ): PackBuilderSection<SN> {
    return new PackBuilderSection({
      ...props,
      ...GetterSection.initProps(props),
    });
  }
  get get() {
    return new GetterSection(this.getterSectionProps);
  }
  get builderSections() {
    return new PackBuilderSections(this.getterSectionsProps);
  }
  static initAsOmniParent() {
    return new PackBuilderSection(UpdaterSection.initOmniParentProps());
  }
  static hydratePackAsOmniChild<SN extends ChildSectionName<"omniParent">>(
    sectionPack: SectionPack<SN>
  ): PackBuilderSection<SN> {
    const builder = this.initAsOmniChild(
      sectionPack.sectionName
    ) as PackBuilderSection<SN>;
    builder.overwriteSelf(sectionPack);
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
  selfPackLoader(sectionPack: SectionPack<SN>): SelfPackLoader<SN> {
    return new SelfPackLoader({
      ...this.getterSectionProps,
      sectionPack,
    });
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
  ): ChildPackArrs<SN, CN> {
    return this.maker.makeChildPackArrs(childNames);
  }
  makeSectionPack(): SectionPack<SN> {
    return this.maker.makeSectionPack();
  }
  addAndGetChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildWithPackOptions<SN, CN>
  ): PackBuilderSection<ChildSectionName<SN, CN>> {
    this.addChild(childName, options);
    return this.youngestChild(childName);
  }
  addChild<CN extends ChildName<SN>>(
    childName: CN,
    {
      sectionValues,
      sectionPack,
      ...rest
    }: AddChildWithPackOptions<SN, CN> = {}
  ): void {
    const child = this.updater.addAndGetChild(childName, rest);

    if (sectionPack) {
      const childBuilder = this.packBuilderSection(child.feInfo);
      childBuilder.overwriteSelf(sectionPack);
    }
    if (sectionValues) {
      child.updateValues(sectionValues);
    }
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
  loadChildren<CN extends ChildName<SN>>({
    childName,
    sectionPacks,
  }: ChildArrPack<SN, CN>) {
    for (const sectionPack of sectionPacks) {
      this.addChild(childName, {
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
      const child = this.addAndGetChild(childName, {
        sectionPack,
      });
      children.push(child);
    }
    return children;
  }
  replaceChildArrs(childPackArrs: Partial<ChildPackArrs<SN>>): void {
    for (const childName of Obj.keys(childPackArrs)) {
      this.replaceChildren({
        childName,
        sectionPacks: childPackArrs[
          childName
        ] as ChildPackArrs<SN>[typeof childName],
      });
    }
  }
  replaceChildren<
    CN extends ChildName<SN>,
    CT extends ChildSectionName<SN, CN>
  >({ childName, sectionPacks }: ChildArrPack<SN, CN, CT>): void {
    this.updater.removeChildren(childName);
    for (const sectionPack of sectionPacks) {
      this.addChild(childName, { sectionPack });
    }
  }
  overwriteSelf(sectionPack: SectionPack<SN>): void {
    this.selfPackLoader(sectionPack).overwriteSelfWithPack();
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
