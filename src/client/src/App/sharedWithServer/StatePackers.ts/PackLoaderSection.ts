import {
  ChildArrPack,
  ChildSectionPack,
  SectionPack,
} from "../SectionPack/SectionPack";
import {
  ChildName,
  ChildType,
} from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionsMeta/SectionName";
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
  SN extends SectionName
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
  updateSelfWithSectionPack(sectionPack: SectionPack<SN>): void {
    const selfPackLoader = new SelfPackLoader({
      ...this.getterSectionProps,
      sectionPack,
    });
    selfPackLoader.updateSelfWithSectionPack();
  }
  loadChildPackArrs(childPackArrs: ChildSectionPackArrs<SN>): void {
    for (const [childName, sectionPacks] of Obj.entries(childPackArrs)) {
      this.loadChildSectionPackArr({
        childName,
        sectionPacks,
      });
    }
  }
  loadChildSectionPackArr<CN extends ChildName<SN>>({
    childName,
    sectionPacks,
  }: ChildArrPack<SN, CN>): void {
    this.update.removeChildren(childName);
    for (const sectionPack of sectionPacks) {
      this.loadChildSectionPack({
        childName,
        sectionPack,
      });
    }
  }
  loadChildSectionPack<CN extends ChildName<SN>, CT extends ChildType<SN, CN>>(
    { childName, sectionPack }: ChildPackInfo<SN, CN, CT>,
    options: { idx?: number } = {}
  ): void {
    const childPackLoader = new ChildPackLoader({
      ...this.getterSectionProps,
      sectionPack: sectionPack as any as SectionPack,
      childDbInfo: {
        childName,
        dbId: sectionPack.dbId,
        ...options,
      },
    });
    childPackLoader.loadChild();
  }
}

export type ChildSectionPackArrs<SN extends SectionName> = {
  [CN in ChildName<SN>]: ChildSectionPack<SN, CN>[];
};

export type ChildPackInfo<
  SN extends SectionName,
  CN extends ChildName<SN> = ChildName<SN>,
  CT extends ChildType<SN, CN> = ChildType<SN, CN>
> = {
  childName: CN;
  sectionPack: SectionPack<CT>;
};
