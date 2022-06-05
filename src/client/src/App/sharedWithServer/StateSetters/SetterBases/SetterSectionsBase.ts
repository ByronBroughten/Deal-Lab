import {
  GetterSectionsBase,
  GetterSectionsProps,
} from "../../StateGetters/Bases/GetterSectionsBase";
import { SetSections } from "../../StateHooks/useSections";

export interface SetterSectionsProps extends GetterSectionsProps {
  setSections: SetSections;
}
export class SetterSectionsBase {
  readonly getterSectionsBase: GetterSectionsBase;
  private setSectionsProp: SetSections;
  readonly setSections: () => void;
  constructor({ setSections, ...rest }: SetterSectionsProps) {
    this.getterSectionsBase = new GetterSectionsBase(rest);
    this.setSectionsProp = setSections;
    this.setSections = () =>
      this.setSectionsProp(
        () => this.getterSectionsBase.sectionsShare.sections
      );
  }
  get setterSectionsProps(): SetterSectionsProps {
    return {
      ...this.getterSectionsBase.getterSectionsProps,
      setSections: this.setSectionsProp,
    };
  }
}
