import { GetterSectionsBase } from "../StateGetters/Bases/GetterSectionsBase";
import {
  RawFeSections,
  StateSections,
} from "../StateSections/StateSectionsNext";

export class UpdaterSections extends GetterSectionsBase {
  updateState(nextState: StateSections): void {
    this.sectionsShare.sections = nextState;
  }
  updateLists(partial: Partial<RawFeSections>): void {
    this.updateState(this.sectionsShare.sections.updateSectionLists(partial));
  }
}
