import { SetSections } from "../../stateClassHooks/useSections";
import {
  GetterSectionsBase,
  GetterSectionsProps,
} from "../../StateGetters/Bases/GetterSectionsBase";
import { StateSections } from "../../StateSections/StateSectionsNext";

export interface SetterSectionsProps extends GetterSectionsProps {
  setSections: SetSections;
}
interface SectionsAndSetSections {
  sections: StateSections;
  setSections: SetSections;
}
export class SetterSectionsBase {
  readonly getterSectionsBase: GetterSectionsBase;
  private setSectionsProp: SetSections;
  readonly initialSections: StateSections;
  constructor({ setSections, ...rest }: SetterSectionsProps) {
    this.initialSections = rest.sectionsShare.sections;
    this.getterSectionsBase = new GetterSectionsBase(rest);
    this.setSectionsProp = setSections;
  }
  updateSetterProps({ sections, setSections }: SectionsAndSetSections) {
    this.getterSectionsBase.updateSections(sections);
    this.setSectionsProp = setSections;
  }
  setSections(): void {
    this.setSectionsProp(() => this.getterSectionsBase.sectionsShare.sections);
  }
  revertSections(): void {
    this.setSectionsProp(() => this.initialSections);
  }
  async tryAndRevertIfFail<FN extends () => any>(
    fn: FN
  ): Promise<ReturnType<FN>> {
    try {
      return fn();
    } catch (err) {
      this.revertSections();
      throw err;
    }
  }
  get setterSectionsProps(): SetterSectionsProps {
    return {
      ...this.getterSectionsBase.getterSectionsProps,
      setSections: this.setSectionsProp,
    };
  }
}
