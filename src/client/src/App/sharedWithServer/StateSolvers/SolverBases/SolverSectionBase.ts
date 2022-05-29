import { FeSectionInfo } from "../../SectionsMeta/Info";
import { SectionName } from "../../SectionsMeta/SectionName";
import { GetterSectionBase } from "../../StateGetters/Bases/GetterSectionBase";
import { SolverSectionsBase, SolverSectionsProps } from "./SolverSectionsBase";

export interface SolverSectionProps<SN extends SectionName>
  extends SolverSectionsProps,
    FeSectionInfo<SN> {}

export class SolverSectionBase<
  SN extends SectionName
> extends SolverSectionsBase {
  readonly getterSectionBase: GetterSectionBase<SN>;
  constructor(props: SolverSectionProps<SN>) {
    super(props);
    this.getterSectionBase = new GetterSectionBase(props);
  }
}
