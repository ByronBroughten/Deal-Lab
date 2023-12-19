import { pick } from "lodash";
import { FeSectionInfo } from "../../SectionInfos/FeInfo";
import { SectionPack } from "../../SectionPacks/SectionPack";
import { StateSections } from "../../State/StateSections";
import { GetterSections } from "../../StateGetters/GetterSections";
import { defaultMaker } from "../../defaultMaker/defaultMaker";
import { SectionName } from "../../sectionVarbsConfig/SectionName";

import { GetterSectionsBase } from "../../StateGetters/Bases/GetterSectionsBase";
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
  static initBuilderFromMainPack(
    sectionPack: SectionPack<"main">
  ): PackBuilderSection<"main"> {
    const sections = StateSections.initWithRoot();
    const rootSection = sections.rawSectionList("root")[0];

    const builder = PackBuilderSection.init({
      ...pick(rootSection, ["sectionName", "feId"]),
      sections,
    });
    builder.addChild("main", { sectionPack });
    return builder.onlyChild("main");
  }
  static initSectionsFromMainPack(
    sectionPack: SectionPack<"main">
  ): StateSections {
    const main = this.initBuilderFromMainPack(sectionPack);
    return main.sectionsShare.sections;
  }
  static initFeStore(): PackBuilderSection<"feStore"> {
    const feStore = PackBuilderSection.initAsOmniChild("feStore");
    feStore.overwriteSelf(defaultMaker.makeSectionPack("feStore"));
    return feStore;
  }
}
