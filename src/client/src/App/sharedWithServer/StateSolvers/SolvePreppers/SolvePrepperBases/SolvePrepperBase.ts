import { FeVarbInfo } from "../../../SectionsMeta/SectionInfo/FeInfo";
import { GetterVarb } from "../../../StateGetters/GetterVarb";
import { SolverBase } from "../../SolverBase";

export class SolvePrepperBase extends SolverBase {
  protected addVarbInfosToSolveFor(...varbInfos: FeVarbInfo[]): void {
    const varbIds = GetterVarb.varbInfosToVarbIds(varbInfos);
    this.addVarbIdsToSolveFor(...varbIds);
  }
  protected addVarbIdsToSolveFor(...varbIds: string[]): void {
    this.updateSolveState(this.solveState.addVarbIdsToSolveFor(...varbIds));
  }
  protected removeVarbIdsToSolveFor(...varbIds: string[]): void {
    this.updateSolveState(this.solveState.removeVarbIdsToSolveFor(...varbIds));
  }
  protected doUpdateOutvarbsOnSolve(): void {
    this.updateSolveState(this.solveState.doUpdateOutvarbsOnSolve());
  }
  protected doNotUpdateOutvarbsOnSolve(): void {
    // Careful with this. If "updateValues" removes entities,
    // Then you'll want to re-add them.
    this.updateSolveState(this.solveState.doNotUpdateOutvarbsOnSolve());
  }
  protected doNotThrowIfEntityToRemoveMissing(): void {
    // This is a temporary fix.
    this.updateSolveState(this.solveState.doNotThrowIfEntityToRemoveMissing());
  }
}
