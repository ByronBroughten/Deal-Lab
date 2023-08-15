import { SolveStateIds } from "./StateSections/SolveStateIds";
import { StateSections } from "./StateSections/StateSections";

export type MainStateProps = {
  stateSections: StateSections;
  solveStateIds: SolveStateIds;
};
export class MainState {
  private stateSections: StateSections;
  private solveStateIds: SolveStateIds;
  constructor(props: MainStateProps) {
    this.stateSections = props.stateSections;
    this.solveStateIds = props.solveStateIds;
  }
  update(partial: Partial<MainStateProps>): MainState {
    return new MainState({
      stateSections: this.stateSections,
      solveStateIds: this.solveStateIds,
      ...partial,
    });
  }
  static initEmpty() {
    return new MainState({
      stateSections: StateSections.initEmpty(),
      solveStateIds: SolveStateIds.initEmpty(),
    });
  }
}
