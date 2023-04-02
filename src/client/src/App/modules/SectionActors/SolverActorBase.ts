import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import {
  SolverSectionBase,
  SolverSectionProps,
} from "../../sharedWithServer/StateSolvers/SolverBases/SolverSectionBase";
import {
  ApiQuerierBase,
  ApiQuerierBaseProps,
} from "../QueriersBasic/Bases/ApiQuerierBase";

export interface SolverActorBaseProps<SN extends SectionName>
  extends ApiQuerierBaseProps,
    SolverSectionProps<SN> {}

export class SolverActorBase<SN extends SectionName> extends ApiQuerierBase {
  readonly solverSectionBase: SolverSectionBase<SN>;
  constructor(props: SolverActorBaseProps<SN>) {
    super(props);
    this.solverSectionBase = new SolverSectionBase(props);
  }
  get get() {
    return new GetterSection(this.solverActorBaseProps);
  }
  get solverActorBaseProps(): SolverActorBaseProps<SN> {
    return {
      ...this.solverSectionBase.solverSectionProps,
      apiQueries: this.apiQueries,
    };
  }
}
