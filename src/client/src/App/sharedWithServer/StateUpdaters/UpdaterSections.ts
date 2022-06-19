import { GetterSectionsBase } from "../StateGetters/Bases/GetterSectionsBase";
import { StateSections } from "../StateSections/StateSections";
import { RawFeSections } from "../StateSections/StateSectionsTypes";

export class UpdaterSections extends GetterSectionsBase {
  updateState(nextState: StateSections): void {
    this.sectionsShare.sections = nextState;
  }
  updateLists(partial: Partial<RawFeSections>): void {
    this.updateState(this.sectionsShare.sections.updateSectionLists(partial));
  }
}
