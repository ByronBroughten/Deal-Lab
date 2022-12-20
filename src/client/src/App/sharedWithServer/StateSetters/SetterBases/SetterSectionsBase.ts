import {
  SectionsAndControls,
  SetSections,
} from "../../stateClassHooks/useSections";
import { GetterSectionsBase } from "../../StateGetters/Bases/GetterSectionsBase";
import { StateSections } from "../../StateSections/StateSections";
import {
  SolverSectionsBase,
  SolverSectionsProps,
  SolverSectionsRequiredProps,
} from "../../StateSolvers/SolverBases/SolverSectionsBase";

export interface SetterSectionsProps extends SolverSectionsProps {
  setSectionsShare: SetSectionsShare;
  initialSectionsShare: InitialSectionsShare;
}
type SetSectionsShare = { setSections: SetSections };
type InitialSectionsShare = { sections: StateSections };

interface SetterSectionsRequiredProps extends SolverSectionsRequiredProps {
  setSections: SetSections;
}
export class SetterSectionsBase {
  readonly solverSectionsBase: SolverSectionsBase;
  private setSectionsShare: SetSectionsShare;
  private initialSectionsShare: InitialSectionsShare;
  constructor({
    setSectionsShare,
    initialSectionsShare,
    ...rest
  }: SetterSectionsProps) {
    this.solverSectionsBase = new SolverSectionsBase(rest);
    this.initialSectionsShare = initialSectionsShare;
    this.setSectionsShare = setSectionsShare;
  }
  static initProps({
    sections,
    setSections,
    ...rest
  }: SetterSectionsRequiredProps): SetterSectionsProps {
    return {
      ...SolverSectionsBase.initProps({ sections, ...rest }),
      setSectionsShare: { setSections },
      initialSectionsShare: { sections },
    };
  }
  get initialSections() {
    return this.initialSectionsShare.sections;
  }
  async tryAndRevertIfFail<FN extends () => any>(
    fn: FN
  ): Promise<ReturnType<FN>> {
    const { initialSections } = this;
    // initialSections must be extracted from this
    // before the try block. Otherwise, this.initialSectionsShare
    // might reset before the catch block for some reason.
    try {
      return await fn();
    } catch (err) {
      this.setSectionsShare.setSections(() => initialSections);
      throw err;
    }
  }
  get getterSectionsBase() {
    return new GetterSectionsBase(this.solverSectionsBase.solverSectionsProps);
  }
  updateSetterProps({ sections, setSections }: SectionsAndControls): void {
    this.getterSectionsBase.updateSections(sections);
    this.initialSectionsShare.sections = sections;
    this.setSectionsShare.setSections = setSections;
  }
  setSections(): void {
    this.setSectionsShare.setSections(
      () => this.getterSectionsBase.sectionsShare.sections
    );
  }
  get setterSectionsProps(): SetterSectionsProps {
    return {
      ...this.solverSectionsBase.solverSectionsProps,
      initialSectionsShare: this.initialSectionsShare,
      setSectionsShare: this.setSectionsShare,
    };
  }
}
