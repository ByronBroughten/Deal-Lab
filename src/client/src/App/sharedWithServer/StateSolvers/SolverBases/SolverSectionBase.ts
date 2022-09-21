import { FeSectionInfo } from "../../SectionsMeta/Info";
import { SectionNameByType } from "../../SectionsMeta/SectionNameByType";
import {
  GetterSectionBase,
  GetterSectionProps,
} from "../../StateGetters/Bases/GetterSectionBase";
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
