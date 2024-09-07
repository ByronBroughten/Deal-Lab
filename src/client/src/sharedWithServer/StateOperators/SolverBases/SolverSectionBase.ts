import {
  GetterSectionBase,
  GetterSectionProps,
} from "../../StateGetters/Bases/GetterSectionBase";
import { FeSectionInfo } from "../../StateGetters/Identifiers/FeInfo";
import { SectionNameByType } from "../../stateSchemas/SectionNameByType";
import { SolverSectionsBase, SolverSectionsProps } from "./SolverSectionsBase";

export interface SolverSectionProps<SN extends SectionNameByType>
  extends SolverSectionsProps,
    FeSectionInfo<SN> {}

export class SolverSectionBase<
  SN extends SectionNameByType
> extends SolverSectionsBase {
  readonly getterSectionBase: GetterSectionBase<SN>;
  constructor(props: SolverSectionProps<SN>) {
    super(props);
    this.getterSectionBase = new GetterSectionBase(props);
  }
  get getterSectionProps(): GetterSectionProps<SN> {
    return this.getterSectionBase.getterSectionProps;
  }
  get solverSectionProps(): SolverSectionProps<SN> {
    return {
      ...this.getterSectionProps,
      ...this.solverSectionsProps,
    };
  }
}
