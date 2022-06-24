import { pick } from "lodash";
import { SectionArrPack, SectionPackRaw } from "../SectionPack/SectionPack";
import { ChildName } from "../SectionsMeta/relSectionTypes/ChildTypes";
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
  updateSelfWithSectionPack(sectionPack: SectionPackRaw<SN>): void {
    const selfPackLoader = new SelfPackLoader({
      ...this.getterSectionProps,
      sectionPack,
    });
    selfPackLoader.updateSelfWithSectionPack();
  }
  loadChildPackArrs(childPackArrs: ChildSectionPackArrs<SN>): void {
    for (const [sectionName, sectionPacks] of Obj.entries(childPackArrs)) {
      this.loadChildSectionPackArr({
        sectionName,
        sectionPacks: sectionPacks as SectionPackRaw<typeof sectionName>[],
      });
    }
  }
  loadChildSectionPackArr<CN extends ChildName<SN>>({
    sectionName,
    sectionPacks,
  }: SectionArrPack<CN>): void {
    this.update.removeChildren(sectionName);
    for (const childPack of sectionPacks) {
      this.loadChildSectionPack(childPack);
    }
  }
  loadChildSectionPack<CN extends ChildName<SN>>(
    sectionPack: SectionPackRaw<CN>,
    options: { idx?: number } = {}
  ): void {
    const childPackLoader = new ChildPackLoader({
      ...this.getterSectionProps,
      sectionPack: sectionPack as any as SectionPackRaw,
      childDbInfo: {
        ...pick(sectionPack, ["sectionName", "dbId"]),
        ...options,
      },
    });
    childPackLoader.loadChild();
  }
}

export type ChildSectionPackArrs<SN extends SectionName> = {
  [CN in ChildName<SN>]: SectionPackRaw<CN>[];
};
