import { SectionNameByType } from "../../SectionNameByType";
import { GetterVarbBase } from "../../StateGetters/Bases/GetterVarbBase";

import { SolverSectionBase, SolverSectionProps } from "./SolverSectionBase";

export interface SolverVarbProps<SN extends SectionNameByType<"hasVarb">>
  extends SolverSectionProps<SN> {
  varbName: string;
}

export class SolverVarbBase<
  SN extends SectionNameByType<"hasVarb">
> extends SolverSectionBase<SN> {
  readonly getterVarbBase: GetterVarbBase<SN>;
  constructor(props: SolverVarbProps<SN>) {
    super(props);
    this.getterVarbBase = new GetterVarbBase(props);
  }
  get solverVarbProps(): SolverVarbProps<SN> {
    return {
      ...this.getterVarbBase.getterVarbProps,
      solveShare: this.solveShare,
    };
  }
}
