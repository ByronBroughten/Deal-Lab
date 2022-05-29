import { StateSections } from "../../StateSections/StateSectionsNext";

export type SharedStateSections = { sections: StateSections };
export type HasSectionsShare = {
  sectionsShare: SharedStateSections;
};
export class GetterSectionsBase {
  constructor(readonly sectionsShare: SharedStateSections) {}
}
