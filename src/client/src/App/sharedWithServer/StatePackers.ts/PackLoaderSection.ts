import { ChildName } from "../SectionsMeta/childSectionsDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/childSectionsDerived/ChildSectionName";
import {
  ChildArrPack,
  ChildSectionPack,
} from "../SectionsMeta/childSectionsDerived/ChildSectionPack";
import { SectionPack } from "../SectionsMeta/childSectionsDerived/SectionPack";
import { FeSectionInfo } from "../SectionsMeta/Info";
import { SectionName } from "../SectionsMeta/SectionName";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import {
  GetterSectionBase,
  GetterSectionProps,
} from "../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../StateGetters/GetterSection";
import { UpdaterSection } from "../StateUpdaters/UpdaterSection";
import { Obj } from "../utils/Obj";
import { ChildPackLoader } from "./PackLoaderSection/ChildPackLoader";
import { SelfPackLoader } from "./PackLoaderSection/SelfPackLoader";

export class PackLoaderSection<
  SN extends SectionNameByType
> extends GetterSectionBase<SN> {
  constructor(props: GetterSectionProps<SN>) {
    super(props);
  }
  get update(): UpdaterSection<SN> {
    return new UpdaterSection(this.getterSectionProps);
  }
  get get(): GetterSection<SN> {
    return new GetterSection(this.getterSectionProps);
  }
  youngestChild<CN extends ChildName<SN>>(
    childName: ChildName<SN>
  ): PackLoaderSection<ChildSectionName<SN, CN>> {
    const { feInfo } = this.get.youngestChild(childName);
    return this.packLoaderSection(feInfo) as PackLoaderSection<any>;
  }
  packLoaderSection<S extends SectionName>(
    feInfo: FeSectionInfo<S>
  ): PackLoaderSection<S> {
    return new PackLoaderSection({
      ...this.getterSectionsProps,
      ...feInfo,
    });
  }
  loadSelfSectionPack(sectionPack: SectionPack<SN>): void {
    const selfPackLoader = new SelfPackLoader({
      ...this.getterSectionProps,
      sectionPack,
    });
    selfPackLoader.loadSelfSectionPack();
  }
  loadChildPackArrs(childPackArrs: Partial<ChildSectionPackArrs<SN>>): void {
    for (const childName of Obj.keys(childPackArrs)) {
      this.loadChildSectionPackArr({
        childName,
        sectionPacks: childPackArrs[
          childName
        ] as ChildSectionPackArrs<SN>[typeof childName],
      });
    }
  }
  loadChildSectionPackArr<
    CN extends ChildName<SN>,
    CT extends ChildSectionName<SN, CN>
  >({ childName, sectionPacks }: ChildArrPack<SN, CN, CT>): void {
    this.update.removeChildren(childName);
    for (const sectionPack of sectionPacks) {
      this.loadChildSectionPack({
        childName,
        sectionPack,
      });
    }
  }
  loadChildSectionPack<
    CN extends ChildName<SN>,
    CT extends ChildSectionName<SN, CN>
  >(
    { childName, sectionPack }: ChildPackInfo<SN, CN, CT>,
    options: { idx?: number } = {}
  ): void {
    const childPackLoader = new ChildPackLoader({
      ...this.getterSectionProps,
      sectionPack: sectionPack as SectionPack<any>,
      spChildInfo: {
        childName,
        spNum: 0,
        ...options,
      },
    });
    childPackLoader.loadChild();
  }
}

export type ChildSectionPackArrs<SN extends SectionNameByType> = {
  [CN in ChildName<SN>]: ChildSectionPack<SN, CN>[];
};

export type ChildPackInfo<
  SN extends SectionNameByType,
  CN extends ChildName<SN> = ChildName<SN>,
  CT extends ChildSectionName<SN, CN> = ChildSectionName<SN, CN>
> = {
  childName: CN;
  sectionPack: SectionPack<CT>;
};
