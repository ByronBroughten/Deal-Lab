import { StateSections } from "../../State/StateSections";
import { RawFeSections } from "../../State/StateSectionsTypes";
import { GetterSectionsBase } from "../../StateGetters/Bases/GetterSectionsBase";

export class UpdaterSections extends GetterSectionsBase {
  updateSections(nextState: StateSections): void {
    this.sectionsShare.sections = nextState;
  }
  updateLists(partial: Partial<RawFeSections>): void {
    this.updateSections(
      this.sectionsShare.sections.updateSectionLists(partial)
    );
  }
}
