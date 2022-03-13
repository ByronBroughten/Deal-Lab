import Analyzer from "../../Analyzer";
import {
  FeVarbInfo,
  SpecificSectionInfo,
} from "../SectionMetas/relSections/rel/relVarbInfoTypes";
import { FeInfo } from "../SectionMetas/Info";
import { internal } from "./internal";

export function eraseSectionAndSolve(
  this: Analyzer,
  info: SpecificSectionInfo
): Analyzer {
  const { feInfo } = this.section(info);
  const [next, infosAffectedByErase] = internal.eraseSectionAndChildren(
    this,
    feInfo
  );
  return next.solveVarbs(infosAffectedByErase);
}

export function eraseSectionsAndSolve(
  this: Analyzer,
  feInfos: FeInfo[]
): Analyzer {
  let infosAffectedByErase: FeVarbInfo[] = [];
  const [next, allAffectedInfos] = feInfos.reduce(
    ([next, allAffectedInfos], feInfo) => {
      [next, infosAffectedByErase] = internal.eraseSectionAndChildren(
        next,
        feInfo
      );
      return [next, allAffectedInfos.concat(infosAffectedByErase)] as const;
    },
    [this, []] as readonly [Analyzer, FeVarbInfo[]]
  );

  return next.solveVarbs(allAffectedInfos);
}
