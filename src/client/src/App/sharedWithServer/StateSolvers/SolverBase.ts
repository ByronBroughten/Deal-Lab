import { GetterSectionsBase } from "../StateGetters/Bases/GetterSectionsBase";
import { SolveState } from "../StateSections/SolveState";
import { StateSections } from "../StateSections/StateSections";
import { SolverProps } from "./Solver";

type SolveShare = { solveState: SolveState };
export type HasSolveShare = {
  solveShare: SolveShare;
};

export class SolverBase {
  readonly solveShare: SolveShare;
  readonly getterSectionsBase: GetterSectionsBase;
  constructor({ solveShare, ...rest }: SolverProps) {
    this.solveShare = solveShare;
    this.getterSectionsBase = new GetterSectionsBase(rest);
  }
  get solverProps(): SolverProps {
    return {
      ...this.getterSectionsBase.getterSectionsProps,
      solveShare: this.solveShare,
    };
  }
  get solveState(): SolveState {
    return this.solveShare.solveState;
  }
  get stateSections(): StateSections {
    return this.getterSectionsBase.sectionsShare.sections;
  }
  get varbIdsToSolveFor(): Set<string> {
    return this.solveState.varbIdsToSolveFor;
  }
  get throwIfEntityToRemoveMissing(): boolean {
    return this.solveState.throwIfEntityToRemoveMissing;
  }
  updateSolveState(nextSolveState: SolveState): void {
    this.solveShare.solveState = nextSolveState;
  }
}
