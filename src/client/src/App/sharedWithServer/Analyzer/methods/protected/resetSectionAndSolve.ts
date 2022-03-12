import Analyzer from "../../../Analyzer";
import { SectionFinder } from "../../SectionMetas/relSections/baseSectionTypes";
import {
  FeNameInfo,
  FeVarbInfo,
} from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { ChildFeInfo } from "../../SectionMetas/relSectionTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import { InitSectionOptions } from "../addSectionAndSolve";

type ResetSectionOptions = Omit<InitSectionOptions, "idx"> & {
  resetDbIds?: boolean;
};
export function resetSection<S extends SectionName<"hasParent">>(
  this: Analyzer,
  info: SectionFinder<S>,
  { resetDbIds = false, ...options }: ResetSectionOptions = {}
): [Analyzer, FeVarbInfo[]] {
  let next = this;
  let affectedInfos: FeVarbInfo[] = [];
  let allAffectedInfos: FeVarbInfo[] = [];
  const feInfo = next.section(info).feInfo as FeNameInfo<S>;
  const parent = next.parent(feInfo);
  const idx = parent.childIdx(feInfo as ChildFeInfo<typeof parent.sectionName>);

  [next, affectedInfos] = next.eraseSectionAndChildren(feInfo);
  allAffectedInfos.push(...affectedInfos);

  const { sectionName } = feInfo;
  [next, affectedInfos] = next.addSections({
    sectionName,
    parentFinder: parent.feInfo,
    ...options,
    idx,
  });
  allAffectedInfos.push(...affectedInfos);

  if (resetDbIds) {
    const { feInfo: newFeInfo } = next.lastSection(sectionName);
    next = next.resetSectionAndChildDbIds(newFeInfo);
  }
  return [next, allAffectedInfos];
}

export function resetSectionAndSolve(
  this: Analyzer,
  finder: SectionFinder<SectionName<"hasParent">>,
  options: ResetSectionOptions = {}
): Analyzer {
  const [next, allAffectedInfos] = this.resetSection(finder, options);
  return next.solveVarbs(allAffectedInfos);
}
