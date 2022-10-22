import { FeSectionInfo } from "../SectionsMeta/Info";
import { feStoreNameS } from "../SectionsMeta/relSectionsDerived/relNameArrs/FeStoreName";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSectionsBase } from "../StateGetters/Bases/GetterSectionsBase";
import { GetterSections } from "../StateGetters/GetterSections";
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
}
