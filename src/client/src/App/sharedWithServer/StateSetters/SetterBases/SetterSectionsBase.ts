import {
  SectionsAndSetSections,
  SetSections,
} from "../../stateClassHooks/useSections";
import {
  GetterSectionsBase,
  GetterSectionsProps,
} from "../../StateGetters/Bases/GetterSectionsBase";
import { StateSections } from "../../StateSections/StateSectionsNext";

export interface SetterSectionsProps extends GetterSectionsProps {
  setSectionsShare: SetSectionsShare;
  initialSectionsShare: InitialSectionsShare;
}
type SetSectionsShare = { setSections: SetSections };
type InitialSectionsShare = { sections: StateSections };

export class SetterSectionsBase {
  readonly getterSectionsBase: GetterSectionsBase;
  private setSectionsShare: SetSectionsShare;
  private initialSectionsShare: InitialSectionsShare;
  constructor({
    setSectionsShare,
    initialSectionsShare,
    ...rest
  }: SetterSectionsProps) {
    this.getterSectionsBase = new GetterSectionsBase(rest);
    this.initialSectionsShare = initialSectionsShare;
    this.setSectionsShare = setSectionsShare;
  }
  static initSectionsProps({
    sections,
    setSections,
  }: SectionsAndSetSections): SetterSectionsProps {
    return {
      setSectionsShare: { setSections },
      initialSectionsShare: { sections },
      sectionsShare: { sections },
    };
  }
  get initialSections() {
    return this.initialSectionsShare.sections;
  }
  updateSetterProps({ sections, setSections }: SectionsAndSetSections): void {
    this.getterSectionsBase.updateSections(sections);
    this.initialSectionsShare.sections = sections;
    this.setSectionsShare.setSections = setSections;
  }
  setSections(): void {
    this.setSectionsShare.setSections(
      () => this.getterSectionsBase.sectionsShare.sections
    );
  }
  revertSections(): void {
    this.setSectionsShare.setSections(() => this.initialSections);
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
      initialSectionsShare: this.initialSectionsShare,
      setSectionsShare: this.setSectionsShare,
    };
  }
}