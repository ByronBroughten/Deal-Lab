import { SolvePrepper } from "./SolvePreppers/SolvePrepper";
import { Solver } from "./Solver";
import { SolverBase } from "./SolverBase";

export class TopOperator extends SolverBase {
  get prepper() {
    return new SolvePrepper(this.solverProps);
  }
  get solver() {
    return new Solver(this.solverProps);
  }
}
