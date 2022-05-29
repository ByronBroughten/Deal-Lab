import { VarbInfo } from "../../SectionsMeta/Info";
import {
  GetterSectionsBase,
  HasSectionsShare,
} from "../../StateGetters/Bases/GetterSectionsBase";
import { GetterVarb } from "../../StateGetters/GetterVarb";

export type SolveShare = { varbFullNamesToSolveFor: Set<string> };
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
  get varbFullNamesToSolveFor(): Set<string> {
    return this.solveShare.varbFullNamesToSolveFor;
  }
  addVarbInfosToSolveFor(...varbInfos: VarbInfo[]): void {
    // ok. I'll change this to use VarbInfo
    const fullNames = varbInfos.map((info) =>
      GetterVarb.feVarbInfoToFullName(info)
    );
    this.solveShare.varbFullNamesToSolveFor = new Set([
      ...this.varbFullNamesToSolveFor,
      ...fullNames,
    ]);
  }
}
