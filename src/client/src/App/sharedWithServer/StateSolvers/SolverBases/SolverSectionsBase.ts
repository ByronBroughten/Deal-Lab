import { VarbInfo } from "../../SectionsMeta/Info";
import {
  GetterSectionsBase,
  HasSectionsShare,
} from "../../StateGetters/Bases/GetterSectionsBase";
import { GetterVarb } from "../../StateGetters/GetterVarb";

export type SolveShare = { varbIdsToSolveFor: Set<string> };
export type HasSolveShare = {
  solveShare: SolveShare;
};

export interface SolverSectionsProps extends HasSectionsShare, HasSolveShare {}
export class SolverSectionsBase {
  readonly solveShare: SolveShare;
  readonly getterSectionsBase: GetterSectionsBase;
  constructor({ solveShare, sectionsShare }: SolverSectionsProps) {
    this.solveShare = solveShare;
    this.getterSectionsBase = new GetterSectionsBase(sectionsShare);
  }
  get sectionsShare() {
    return this.getterSectionsBase.sectionsShare;
  }
  get solverSectionsProps() {
    return {
      sectionsShare: this.sectionsShare,
      solveShare: this.solveShare,
    };
  }
  get varbIdsToSolveFor(): Set<string> {
    return this.solveShare.varbIdsToSolveFor;
  }
  addVarbInfosToSolveFor(...varbInfos: VarbInfo[]): void {
    const varbIds = GetterVarb.varbInfosToVarbIds(varbInfos);
    this.addVarbIdsToSolveFor(...varbIds);
  }
  addVarbIdsToSolveFor(...varbIds: string[]): void {
    this.solveShare.varbIdsToSolveFor = new Set([
      ...this.varbIdsToSolveFor,
      ...varbIds,
    ]);
  }
}
