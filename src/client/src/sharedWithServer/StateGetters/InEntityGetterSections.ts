import { FeSectionInfo } from "../SectionInfos/FeInfo";
import { SectionName } from "../stateSchemas/SectionName";
import { GetterSectionsBase } from "./Bases/GetterSectionsBase";
import { GetterSections } from "./GetterSections";
import { InEntityGetterSection } from "./InEntityGetterSection";

export class InEntityGetterSections extends GetterSectionsBase {
  inEntitySection<SN extends SectionName>(
    feInfo: FeSectionInfo<SN>
  ): InEntityGetterSection<SN> {
    return new InEntityGetterSection({
      ...this.getterSectionsProps,
      ...feInfo,
    });
  }
  get getterSections() {
    return new GetterSections(this.getterSectionsProps);
  }
  get appWideVarbInfosWithInEntities() {
    const root = this.inEntitySection(this.getterSections.root);
    return root.selfAndDescendantVarbInfosWithEntities;
  }
}
