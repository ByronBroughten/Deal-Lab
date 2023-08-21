import { SectionName } from "../../../SectionsMeta/SectionName";
import {
  GetterVarbBase,
  GetterVarbProps,
} from "../../../StateGetters/Bases/GetterVarbBase";
import { SolverProps } from "../../Solver";
import { SolvePrepperSectionBase } from "./SolvePrepperSectionBase";

interface SolvePrepperSectionProps<SN extends SectionName>
  extends SolverProps,
    GetterVarbProps<SN> {}

export class SolvePrepperVarbBase<
  SN extends SectionName
> extends SolvePrepperSectionBase<SN> {
  readonly getterVarbBase: GetterVarbBase<SN>;
  constructor(props: SolvePrepperSectionProps<SN>) {
    super(props);
    this.getterVarbBase = new GetterVarbBase(props);
  }
  get getterVarbProps(): GetterVarbProps<SN> {
    return this.getterVarbBase.getterVarbProps;
  }
}
