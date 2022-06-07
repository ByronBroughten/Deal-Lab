import { pick } from "lodash";
import { SectionArrPack, SectionPackRaw } from "../SectionPack/SectionPackRaw";
import { ChildName } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import {
  GetterSectionBase,
  GetterSectionProps,
} from "../StateGetters/Bases/GetterSectionBase";
import { GetterList } from "../StateGetters/GetterList";
import { StateSections } from "../StateSections/StateSectionsNext";
import { UpdaterSection } from "../StateUpdaters/UpdaterSection";
import { Obj } from "../utils/Obj";
import { ChildPackLoader } from "./PackLoaderSection/ChildPackLoader";
import { SelfPackLoader } from "./PackLoaderSection/SelfPackLoader";

export class PackLoaderSection<
  SN extends SectionName
> extends GetterSectionBase<SN> {
  updaterSection: UpdaterSection<SN>;
  constructor(props: GetterSectionProps<SN>) {
    super(props);
    this.updaterSection = new UpdaterSection(props);
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
      this.loadSectionPackChildren({
        sectionName,
        sectionPacks: sectionPacks as SectionPackRaw<typeof sectionName>[],
      });
    }
  }
  loadSectionPackChildren<CN extends ChildName<SN>>({
    sectionName,
    sectionPacks,
  }: SectionArrPack<CN>): void {
    this.updaterSection.removeChildren(sectionName);
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
  static initSectionsFromMainPack(
    sectionPack: SectionPackRaw<"main">
  ): StateSections {
    const sections = StateSections.initWithMain();
    const mainList = new GetterList({
      sectionName: "main",
      sectionsShare: { sections },
    });

    const loader = new PackLoaderSection({
      ...mainList.oneAndOnly.feSectionInfo,
      sectionsShare: { sections },
    });

    loader.updateSelfWithSectionPack(sectionPack);
    return loader.sectionsShare.sections;
  }
}

export type ChildSectionPackArrs<SN extends SectionName> = {
  [CN in ChildName<SN>]: SectionPackRaw<CN>[];
};
