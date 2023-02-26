import { pick } from "lodash";
import { feStoreNameS } from "../SectionsMeta/relSectionsDerived/FeStoreName";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { FeSectionInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSectionsBase } from "../StateGetters/Bases/GetterSectionsBase";
import { GetterSections } from "../StateGetters/GetterSections";
import { StateSections } from "../StateSections/StateSections";
import { PackBuilderSection } from "./PackBuilderSection";

export class PackBuilderSections extends GetterSectionsBase {
  section<SN extends SectionName>(
    feInfo: FeSectionInfo<SN>
  ): PackBuilderSection<SN> {
    return new PackBuilderSection({
      ...this.getterSectionsProps,
      ...feInfo,
    });
  }
  get get() {
    return new GetterSections(this.getterSectionsProps);
  }
  oneAndOnly<SN extends SectionName>(sectionName: SN) {
    return new PackBuilderSection({
      ...this.get.oneAndOnly(sectionName),
      ...this.getterSectionsProps,
    });
  }
  get mainIndexSections() {
    const feUser = this.oneAndOnly("feUser");
    const childPackArrs = feUser.maker.makeChildPackArrs(
      feStoreNameS.arrs.fullIndex
    );
    const indexUser = PackBuilderSection.initAsOmniChild("feUser");
    indexUser.replaceChildArrs(childPackArrs);
    return indexUser.builderSections;
  }
  static initBuilderFromMainPack(
    sectionPack: SectionPack<"main">
  ): PackBuilderSection<"main"> {
    const sections = StateSections.initWithRoot();
    const rootSection = sections.rawSectionList("root")[0];

    const builder = PackBuilderSection.init({
      ...pick(rootSection, ["sectionName", "feId"]),
      sections,
    });
    builder.loadChild({
      childName: "main",
      sectionPack,
    });
    return builder.onlyChild("main");
  }
  static initSectionsFromMainPack(
    sectionPack: SectionPack<"main">
  ): StateSections {
    const main = this.initBuilderFromMainPack(sectionPack);
    return main.sectionsShare.sections;
  }
}
