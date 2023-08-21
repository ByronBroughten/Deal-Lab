import { Arr } from "../utils/Arr";

export type VarbIdsToSolveFor = Set<string>;

type SolveStateProps = {
  varbIdsToSolveFor: VarbIdsToSolveFor;
  updateOutEntitiesOnSolve: boolean;
  throwIfEntityToRemoveMissing: boolean;
};

export class SolveState {
  readonly varbIdsToSolveFor: VarbIdsToSolveFor;
  readonly updateOutEntitiesOnSolve: boolean;
  readonly throwIfEntityToRemoveMissing: boolean;
  constructor(props: SolveStateProps) {
    this.varbIdsToSolveFor = props.varbIdsToSolveFor;
    this.updateOutEntitiesOnSolve = props.updateOutEntitiesOnSolve;
    this.throwIfEntityToRemoveMissing = props.throwIfEntityToRemoveMissing;
  }
  private get solveStateProps(): SolveStateProps {
    return {
      varbIdsToSolveFor: this.varbIdsToSolveFor,
      updateOutEntitiesOnSolve: this.updateOutEntitiesOnSolve,
      throwIfEntityToRemoveMissing: this.throwIfEntityToRemoveMissing,
    };
  }
  update(partial: Partial<SolveStateProps>): SolveState {
    return new SolveState({
      ...this.solveStateProps,
      ...partial,
    });
  }
  doNotThrowIfEntityToRemoveMissing(): SolveState {
    return this.update({ throwIfEntityToRemoveMissing: false });
  }
  doUpdateOutvarbsOnSolve(): SolveState {
    return this.update({ updateOutEntitiesOnSolve: true });
  }
  doNotUpdateOutvarbsOnSolve(): SolveState {
    return this.update({ updateOutEntitiesOnSolve: false });
  }
  addVarbIdsToSolveFor(...varbIds: string[]): SolveState {
    return this.updateVarbIdsToSolveFor(
      new Set([...this.varbIdsToSolveFor, ...varbIds])
    );
  }
  removeVarbIdsToSolveFor(...varbIds: string[]): SolveState {
    return this.updateVarbIdsToSolveFor(
      new Set(Arr.exclude([...this.varbIdsToSolveFor], varbIds))
    );
  }
  private updateVarbIdsToSolveFor(nextVarbIds: VarbIdsToSolveFor): SolveState {
    return this.update({ varbIdsToSolveFor: nextVarbIds });
  }
  static initEmpty(): SolveState {
    return new SolveState({
      varbIdsToSolveFor: new Set(),
      updateOutEntitiesOnSolve: false,
      throwIfEntityToRemoveMissing: true,
    });
  }
}
