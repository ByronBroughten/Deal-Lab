import { MainStateProps } from "../../State/MainState";
import { SolveState } from "../../State/SolveState";
import { StateSections } from "../../State/StateSections";
import {
  GetterSectionsBase,
  GetterSectionsProps,
  GetterSectionsRequiredProps,
} from "../../StateGetters/Bases/GetterSectionsBase";
import { GetterVarb } from "../../StateGetters/GetterVarb";
import { FeVarbInfo } from "../../StateGetters/Identifiers/FeInfo";

type SolveShare = { solveState: SolveState };
export type HasSolveShare = {
  solveShare: SolveShare;
};

export type SolverSectionsRequiredProps = GetterSectionsRequiredProps;

export interface SolverSectionsProps
  extends GetterSectionsProps,
    HasSolveShare {}
export class SolverSectionsBase {
  readonly solveShare: SolveShare;
  readonly getterSectionsBase: GetterSectionsBase;
  constructor({ solveShare, ...rest }: SolverSectionsProps) {
    this.solveShare = solveShare;
    this.getterSectionsBase = new GetterSectionsBase(rest);
  }
  static initProps(props: SolverSectionsRequiredProps): SolverSectionsProps {
    return {
      ...GetterSectionsBase.initProps(props),
      solveShare: { solveState: SolveState.initEmpty() },
    };
  }
  static initSolveShare(): SolveShare {
    return { solveState: SolveState.initEmpty() };
  }
  get stateSections(): StateSections {
    return this.sectionsShare.sections;
  }
  get solveState(): SolveState {
    return this.solveShare.solveState;
  }
  get mainStateProps(): MainStateProps {
    return {
      stateSections: this.stateSections,
      solveState: this.solveState,
    };
  }
  get sectionsShare() {
    return this.getterSectionsBase.sectionsShare;
  }
  get solverSectionsProps(): SolverSectionsProps {
    return {
      ...this.getterSectionsBase.getterSectionsProps,
      solveShare: this.solveShare,
    };
  }
  get varbIdsToSolveFor(): Set<string> {
    return this.solveState.varbIdsToSolveFor;
  }
  addVarbInfosToSolveFor(...varbInfos: FeVarbInfo[]): void {
    const varbIds = GetterVarb.varbInfosToVarbIds(varbInfos);
    this.addVarbIdsToSolveFor(...varbIds);
  }
  addVarbIdsToSolveFor(...varbIds: string[]): void {
    this.solveShare.solveState = this.solveState.addVarbIdsToSolveFor(
      ...varbIds
    );
  }
  removeVarbIdsToSolveFor(...varbIds: string[]): void {
    this.solveShare.solveState = this.solveState.removeVarbIdsToSolveFor(
      ...varbIds
    );
  }
}
