import { StateSections } from "../../State/StateSections";
import { sectionsMeta } from "../StateMeta/SectionsMeta";

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
    return { sectionsShare: this.sectionsShare };
  }
  static initProps({
    sections,
  }: GetterSectionsRequiredProps): GetterSectionsProps {
    return { sectionsShare: { sections } };
  }
  updateSections(sections: StateSections): void {
    this.sectionsShare.sections = sections;
  }
}

export type GetterSectionsRequiredProps = {
  sections: StateSections;
};
