import Analyzer from "../../Analyzer";
import { ChildFeInfo } from "../SectionMetas/relNameArrs/ChildTypes";
import { SectionFinder } from "../SectionMetas/relSections/baseSectionTypes";
import {
  FeNameInfo,
  FeVarbInfo,
} from "../SectionMetas/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../SectionMetas/SectionName";
import { InitSectionOptions } from "./addSectionAndSolve";
import { internal } from "./internal";

type ResetSectionOptions = Omit<InitSectionOptions, "idx"> & {
  resetDbIds?: boolean;
};
function resetSection<S extends SectionName<"hasParent">>(
  analyzer: Analyzer,
  info: SectionFinder<S>,
  { resetDbIds = false, ...options }: ResetSectionOptions = {}
): [Analyzer, FeVarbInfo[]] {
  let next = analyzer;
  let affectedInfos: FeVarbInfo[] = [];
  let allAffectedInfos: FeVarbInfo[] = [];
  const feInfo = next.section(info).feInfo as FeNameInfo<S>;
  const parent = next.parent(feInfo);
  const idx = parent.childIdx(feInfo as ChildFeInfo<typeof parent.sectionName>);

  [next, affectedInfos] = internal.eraseSectionAndChildren(next, feInfo);
  allAffectedInfos.push(...affectedInfos);

  const { sectionName } = feInfo;
  next = internal.addSections(next, {
    sectionName,
    parentFinder: parent.feInfo,
    ...options,
    idx,
  });
  allAffectedInfos.push(...affectedInfos);

  if (resetDbIds) {
    const { feInfo: newFeInfo } = next.lastSection(sectionName);
    next = internal.resetSectionAndChildDbIds(next, newFeInfo);
  }
  return [next, allAffectedInfos];
}

export function resetSectionAndSolve(
  this: Analyzer,
  finder: SectionFinder<SectionName<"hasParent">>,
  options: ResetSectionOptions = {}
): Analyzer {
  const [next, allAffectedInfos] = resetSection(this, finder, options);
  return next.solveVarbs(allAffectedInfos);
}
