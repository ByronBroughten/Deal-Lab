import {
  hasDefaultChild,
  makeDefaultChildPack,
} from "../defaultMaker/defaultChildMakers";
import { defaultMaker } from "../defaultMaker/defaultMaker";
import {
  ChildName,
  FeChildInfo,
} from "../SectionsMeta/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { ParentNameSafe } from "../SectionsMeta/sectionChildrenDerived/ParentName";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { FeSectionInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { PackLoaderSection } from "../StatePackers.ts/PackLoaderSection";
import { UpdaterSectionBase } from "./bases/updaterSectionBase";
import { AddChildOptions, UpdaterSection } from "./UpdaterSection";

export class DefaultFamilyAdder<
  SN extends SectionNameByType
> extends UpdaterSectionBase<SN> {
  get updater(): UpdaterSection<SN> {
    return new UpdaterSection(this.getterSectionProps);
  }
  get loader(): PackLoaderSection<SN> {
    return new PackLoaderSection(this.getterSectionProps);
  }
  private loadChildDefaultState<CN extends ChildName<SN>>(
    childInfo: FeChildInfo<SN, CN>
  ) {
    let sectionPack: SectionPack<ChildSectionName<SN, CN>> | undefined;
    const { childName } = childInfo;
    const { sectionName, feInfo } = this.get.child(childInfo);

    if (hasDefaultChild(this.sectionName, childName)) {
      sectionPack = makeDefaultChildPack(this.sectionName, childName);
    } else if (defaultMaker.has(sectionName)) {
      sectionPack = defaultMaker.makeSectionPack(sectionName);
    }

    if (sectionPack) {
      const childLoader = this.loader.packLoaderSection(feInfo);
      childLoader.loadSelfSectionPack(sectionPack);
    }
  }
  addChild<CN extends ChildName<SN>>(
    childName: CN,
    { sectionValues, ...rest }: AddChildOptions<SN, CN> = {}
  ): void {
    this.updater.addChild(childName, rest);
    const { feId, feInfo } = this.get.youngestChild(childName);
    this.loadChildDefaultState({
      childName,
      feId,
    });
    if (sectionValues) {
      const childUpdater = this.updater.updaterSection(feInfo);
      childUpdater.updateValues(sectionValues);
    }
  }
  private get parent(): DefaultFamilyAdder<ParentNameSafe<SN>> {
    const { parentInfoSafe } = this.get;
    return this.newAdder(parentInfoSafe);
  }
  newAdder<SN extends SectionNameByType>(
    feInfo: FeSectionInfo<SN>
  ): DefaultFamilyAdder<SN> {
    return new DefaultFamilyAdder({
      ...feInfo,
      ...this.getterSectionsProps,
    });
  }
}
