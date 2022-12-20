import { FeVarbInfo } from "../../SectionsMeta/SectionInfo/FeInfo";
import { SectionPathContextName } from "../../SectionsMeta/sectionPathContexts";
import {
  GetterSectionsBase,
  GetterSectionsProps,
  GetterSectionsRequiredProps,
} from "../../StateGetters/Bases/GetterSectionsBase";
import { GetterVarb } from "../../StateGetters/GetterVarb";

export type SolveShare = { varbIdsToSolveFor: Set<string> };
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
      solveShare: this.initSolveShare(),
    };
  }
  static initSolveShare(): SolveShare {
    return {
      varbIdsToSolveFor: new Set(),
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
    return this.solveShare.varbIdsToSolveFor;
  }
  updateSectionContextName(sectionContextName: SectionPathContextName): void {
    this.getterSectionsBase.updateSectionContextName(sectionContextName);
  }
  addVarbInfosToSolveFor(...varbInfos: FeVarbInfo[]): void {
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
