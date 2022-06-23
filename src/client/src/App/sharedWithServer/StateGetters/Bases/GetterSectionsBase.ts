import { sectionsMeta } from "../../SectionsMeta";
import { StateSections } from "../../StateSections/StateSections";

export interface GetterSectionsProps {
  sectionsShare: SectionsShare;
}

export type SectionsShare = { sections: StateSections };
export class GetterSectionsBase {
  readonly sectionsShare: SectionsShare;
  constructor({ sectionsShare }: GetterSectionsProps) {
    this.sectionsShare = sectionsShare;
  }
  get sectionsMeta() {
    return sectionsMeta;
  }
  get stateSections(): StateSections {
    return this.sectionsShare.sections;
  }
  get getterSectionsProps(): GetterSectionsProps {
    return {
      sectionsShare: this.sectionsShare,
    };
  }
  updateSections(sections: StateSections) {
    this.sectionsShare.sections = sections;
  }
}
