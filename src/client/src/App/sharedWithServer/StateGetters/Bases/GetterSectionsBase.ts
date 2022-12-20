import { SectionPathContextName } from "../../../sharedWithServer/SectionsMeta/sectionPathContexts";
import { sectionsMeta } from "../../SectionsMeta";
import { StateSections } from "../../StateSections/StateSections";

export interface GetterSectionsProps {
  sectionsShare: SectionsShare;
  contextShare: ContextShare;
}

export type SectionsShare = { sections: StateSections };
type ContextShare = { sectionContextName: SectionPathContextName };
export class GetterSectionsBase {
  readonly sectionsShare: SectionsShare;
  readonly contextShare: ContextShare;
  constructor({ sectionsShare, contextShare }: GetterSectionsProps) {
    this.sectionsShare = sectionsShare;
    this.contextShare = contextShare ?? {
      sectionContextName: "activeDealPage",
    };
  }
  get sectionsMeta() {
    return sectionsMeta;
  }
  get sectionContextName(): SectionPathContextName {
    return this.contextShare.sectionContextName;
  }
  get stateSections(): StateSections {
    return this.sectionsShare.sections;
  }
  get getterSectionsProps(): GetterSectionsProps {
    return {
      sectionsShare: this.sectionsShare,
      contextShare: this.contextShare,
    };
  }
  static initProps({
    sections,
    sectionContextName,
  }: GetterSectionsRequiredProps): GetterSectionsProps {
    return {
      sectionsShare: { sections },
      contextShare: { sectionContextName },
    };
  }
  updateSections(sections: StateSections): void {
    this.sectionsShare.sections = sections;
  }
  updateSectionContextName(sectionContextName: SectionPathContextName): void {
    this.contextShare.sectionContextName = sectionContextName;
  }
}

export type GetterSectionsRequiredProps = {
  sections: StateSections;
  sectionContextName: SectionPathContextName;
};
