import { SolveState } from "./SolveState";
import { StateSections } from "./StateSections";

export type MainStateProps = {
  stateSections: StateSections;
  solveState: SolveState;
};
export class MainState {
  readonly stateSections: StateSections;
  readonly solveState: SolveState;
  constructor(props: MainStateProps) {
    this.stateSections = props.stateSections;
    this.solveState = props.solveState;
  }
  get varbsToSolveCount(): number {
    return this.solveState.varbIdsToSolveFor.size;
  }
  update(partial: Partial<MainStateProps>): MainState {
    return new MainState({
      stateSections: this.stateSections,
      solveState: this.solveState,
      ...partial,
    });
  }
  static initEmpty(
    props: { stateSections?: StateSections; solveState?: SolveState } = {}
  ) {
    return new MainState({
      stateSections: props.stateSections ?? StateSections.initEmpty(),
      solveState: props.solveState ?? SolveState.initEmpty(),
    });
  }
}
