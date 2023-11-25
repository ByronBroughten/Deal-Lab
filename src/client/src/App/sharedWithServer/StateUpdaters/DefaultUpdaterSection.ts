import {
  ChildName,
  FeChildInfo,
} from "../SectionsMeta/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { FeSectionInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { SectionValues } from "../SectionsMeta/values/StateValue";
import { AddChildWithPackOptions } from "../StatePackers/PackBuilderSection";
import { DefaultSelfPackLoader } from "../StatePackers/PackLoaderSection/DefaultSelfPackLoader";
import { DefaultStateLoader } from "../StatePackers/PackLoaderSection/DefaultStateLoader";
import { UpdaterSectionBase } from "./bases/updaterSectionBase";
import { UpdaterSection } from "./UpdaterSection";

export class DefaultUpdaterSection<
  SN extends SectionName
> extends UpdaterSectionBase<SN> {
  get updater(): UpdaterSection<SN> {
    return new UpdaterSection(this.getterSectionProps);
  }
  defaultUpdater<SN extends SectionNameByType>(
    feInfo: FeSectionInfo<SN>
  ): DefaultUpdaterSection<SN> {
    return new DefaultUpdaterSection({
      ...feInfo,
      ...this.getterSectionsProps,
    });
  }
  removeSelf() {
    this.updater.removeSelf();
  }
  updateValues(values: Partial<SectionValues<SN>>) {
    this.updater.updateValues(values);
  }
  get defaultStateLoader(): DefaultStateLoader<SN> {
    return new DefaultStateLoader(this.getterSectionProps);
  }
  defaultPackLoader(sectionPack: SectionPack<SN>): DefaultSelfPackLoader<SN> {
    return new DefaultSelfPackLoader({
      ...this.getterSectionProps,
      sectionPack,
    });
  }
  loadSelfSectionPack(sectionPack: SectionPack<SN>) {
    this.defaultPackLoader(sectionPack).integrateSectionPack();
  }
  overwriteSelf(sectionPack: SectionPack<SN>) {
    this.defaultPackLoader(sectionPack).overwriteSelf();
  }
  youngestChild<CN extends ChildName<SN>>(childName: CN) {
    return this.defaultUpdater(this.get.youngestChild(childName).feInfo);
  }
  addChild<CN extends ChildName<SN>>(
    childName: CN,
    {
      sectionValues,
      sectionPack,
      dbId,
      ...rest
    }: AddChildWithPackOptions<SN, CN> = {}
  ): void {
    this.updater.addChild(childName, rest);
    const child = this.youngestChild(childName);

    if (sectionPack) {
      child.defaultPackLoader(sectionPack).integrateSectionPack();
    } else {
      child.defaultStateLoader.loadSelfDefaultState();
    }

    if (dbId) {
      child.updater.updateDbId(dbId);
    }
    if (sectionValues) {
      child.updater.updateValues(sectionValues);
    }
  }
  addAndGetChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildWithPackOptions<SN, CN>
  ): DefaultUpdaterSection<ChildSectionName<SN, CN>> {
    this.addChild(childName, options);
    return this.youngestChild(childName);
  }
  static loadAsOmniChild<SN extends ChildSectionName<"omniParent">>(
    sectionPack: SectionPack<SN>
  ): DefaultUpdaterSection<SN> {
    const adder = this.initAsOmniChild(
      sectionPack.sectionName
    ) as DefaultUpdaterSection<SN>;
    adder.loadSelfSectionPack(sectionPack);
    return adder;
  }
  child<CN extends ChildName<SN>>(
    info: FeChildInfo<SN, CN>
  ): DefaultUpdaterSection<ChildSectionName<SN, CN>> {
    return this.defaultUpdater(this.get.child(info).feInfo);
  }
  onlyChild<CN extends ChildName<SN>>(
    childName: CN
  ): DefaultUpdaterSection<ChildSectionName<SN, CN>> {
    return this.defaultUpdater(this.get.onlyChild(childName).feInfo);
  }
  makeSectionPack() {
    return this.get.makeSectionPack();
  }
  static initAsOmniChild<CN extends ChildName<"omniParent">>(
    childName: CN,
    options?: AddChildWithPackOptions<"omniParent", CN>
  ): DefaultUpdaterSection<ChildSectionName<"omniParent", CN>> {
    const adder = this.initAsOmniParent();
    return adder.addAndGetChild(childName, options);
  }
  static initAsOmniParent(): DefaultUpdaterSection<"omniParent"> {
    return new DefaultUpdaterSection(UpdaterSection.initOmniParentProps());
  }
}
