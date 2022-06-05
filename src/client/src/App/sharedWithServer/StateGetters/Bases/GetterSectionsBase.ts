import { StateSections } from "../../StateSections/StateSectionsNext";

export interface GetterSectionsProps {
  sectionsShare: SharedStateSections;
}

type SharedStateSections = { sections: StateSections };
export class GetterSectionsBase {
  readonly sectionsShare: SharedStateSections;
  constructor({ sectionsShare }: GetterSectionsProps) {
    this.sectionsShare = sectionsShare;
  }
  get getterSectionsProps(): GetterSectionsProps {
    return {
      sectionsShare: this.sectionsShare,
    };
  }
}
