import { StateSections } from "./StateSections";
import { RawFeSections } from "./StateSectionsTypes";

export type SolveShare = { varbIdsToSolveFor: Set<string> };

type SolveStateSectionsProps = {
  core: RawFeSections;
  solveShare: SolveShare;
};

export class SolveStateSections {
  solveShare: SolveShare;
  stateSections: StateSections;
  constructor({ core, solveShare }: SolveStateSectionsProps) {
    this.stateSections = new StateSections(core);
    this.solveShare = solveShare;
  }
  static initEmpty(): SolveStateSections {
    return new SolveStateSections(this.initProps());
  }
  static initProps(
    props: Partial<SolveStateSectionsProps> = {}
  ): SolveStateSectionsProps {
    return {
      core: StateSections.emptyRawSections(),
      solveShare: this.initSolveShare(),
      ...props,
    };
  }
  static initSolveShare(): SolveShare {
    return {
      varbIdsToSolveFor: new Set(),
    };
  }
}
