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
import { AddChildWithPackOptions } from "../StatePackers/PackBuilderSection";
import { SelfPackLoader } from "./../StatePackers/PackLoaderSection/SelfPackLoader";
import { UpdaterSectionBase } from "./bases/updaterSectionBase";
import { UpdaterSection } from "./UpdaterSection";

export class DefaultFamilyAdder<
  SN extends SectionNameByType
> extends UpdaterSectionBase<SN> {
  get updater(): UpdaterSection<SN> {
    return new UpdaterSection(this.getterSectionProps);
  }
  selfPackLoader(sectionPack: SectionPack<SN>): SelfPackLoader<SN> {
    return new SelfPackLoader({
      ...this.getterSectionProps,
      sectionPack,
    });
  }
  get selfChildName() {
    return this.get.selfChildName;
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
    child.loadSelfDefaultState();

    if (sectionPack) {
      child.selfPackLoader(sectionPack).integrateSectionPack();
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
    this.loadSelfDefaultState();
    this.selfPackLoader(sectionPack).integrateSectionPack();
  }
  private loadSelfDefaultState() {
    const parentUpdater = this.parent.updater;
    const parentSectionName = parentUpdater.sectionName;

    const { sectionName, selfChildName } = this;

    let sectionPack: SectionPack<SN> | undefined;
    if (hasDefaultChild(parentSectionName, selfChildName)) {
      sectionPack = makeDefaultChildPack(
        parentUpdater,
        selfChildName
      ) as SectionPack<SN>;
    } else if (defaultMaker.has(sectionName)) {
      sectionPack = defaultMaker.makeSectionPack(sectionName);
    }
    if (sectionPack) {
      this.selfPackLoader(sectionPack).overwriteSelfWithPack();
    }
  }
  child<CN extends ChildName<SN>>(
    info: FeChildInfo<SN, CN>
  ): DefaultFamilyAdder<ChildSectionName<SN, CN>> {
    return this.newAdder(this.get.child(info).feInfo);
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
