import { FeVarbInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { Arr } from "../utils/Arr";

export type VarbIdsToSolveFor = Set<string>;

export class SolveStateIds {
  private varbIdsToSolveFor: VarbIdsToSolveFor;
  constructor(varbIdsToSolveFor: VarbIdsToSolveFor) {
    this.varbIdsToSolveFor = varbIdsToSolveFor;
  }
  updateVarbIdsToSolveFor(nextVarbIds: VarbIdsToSolveFor): SolveStateIds {
    return new SolveStateIds(nextVarbIds);
  }
  addVarbInfosToSolveFor(...varbInfos: FeVarbInfo[]): SolveStateIds {
    const varbIds = GetterVarb.varbInfosToVarbIds(varbInfos);
    return this.addVarbIdsToSolveFor(...varbIds);
  }
  addVarbIdsToSolveFor(...varbIds: string[]): SolveStateIds {
    return this.updateVarbIdsToSolveFor(
      new Set([...this.varbIdsToSolveFor, ...varbIds])
    );
  }
  removeVarbIdsToSolveFor(...varbIds: string[]): SolveStateIds {
    return this.updateVarbIdsToSolveFor(
      new Set(Arr.exclude([...this.varbIdsToSolveFor], varbIds))
    );
  }
  static initEmpty(): SolveStateIds {
    return new SolveStateIds(new Set());
  }
}
