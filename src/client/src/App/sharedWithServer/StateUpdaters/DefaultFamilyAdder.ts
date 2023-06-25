import {
  ChildName,
  FeChildInfo,
} from "../SectionsMeta/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { FeSectionInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { AddChildWithPackOptions } from "../StatePackers/PackBuilderSection";
import { DefaultSelfPackLoader } from "../StatePackers/PackLoaderSection/DefaultSelfPackLoader";
import { DefaultStateLoader } from "../StatePackers/PackLoaderSection/DefaultStateLoader";
import { UpdaterSectionBase } from "./bases/updaterSectionBase";
import { UpdaterSection } from "./UpdaterSection";

export class DefaultFamilyAdder<
  SN extends SectionName
> extends UpdaterSectionBase<SN> {
  get updater(): UpdaterSection<SN> {
    return new UpdaterSection(this.getterSectionProps);
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
  youngestChild<CN extends ChildName<SN>>(childName: CN) {
    return this.newAdder(this.get.youngestChild(childName).feInfo);
  }
  addChild<CN extends ChildName<SN>>(
    childName: CN,
    {
      sectionValues,
      sectionPack,
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
    if (sectionValues) {
      child.updater.updateValues(sectionValues);
    }
  }
  addAndGetChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildWithPackOptions<SN, CN>
  ): DefaultFamilyAdder<ChildSectionName<SN, CN>> {
    this.addChild(childName, options);
    return this.youngestChild(childName);
  }
  static loadAsOmniChild<SN extends ChildSectionName<"omniParent">>(
    sectionPack: SectionPack<SN>
  ): DefaultFamilyAdder<SN> {
    const adder = this.initAsOmniChild(
      sectionPack.sectionName
    ) as DefaultFamilyAdder<SN>;
    adder.loadSelfSectionPack(sectionPack);
    return adder;
  }
  loadSelfSectionPack(sectionPack: SectionPack<SN>) {
    this.defaultPackLoader(sectionPack).integrateSectionPack();
  }
  child<CN extends ChildName<SN>>(
    info: FeChildInfo<SN, CN>
  ): DefaultFamilyAdder<ChildSectionName<SN, CN>> {
    return this.newAdder(this.get.child(info).feInfo);
  }

  newAdder<SN extends SectionNameByType>(
    feInfo: FeSectionInfo<SN>
  ): DefaultFamilyAdder<SN> {
    return new DefaultFamilyAdder({
      ...feInfo,
      ...this.getterSectionsProps,
    });
  }
  static initAsOmniChild<CN extends ChildName<"omniParent">>(
    childName: CN,
    options?: AddChildWithPackOptions<"omniParent", CN>
  ): DefaultFamilyAdder<ChildSectionName<"omniParent", CN>> {
    const adder = this.initAsOmniParent();
    return adder.addAndGetChild(childName, options);
  }
  static initAsOmniParent(): DefaultFamilyAdder<"omniParent"> {
    return new DefaultFamilyAdder(UpdaterSection.initOmniParentProps());
  }
}
