import Analyzer from "../../Analyzer";
import { SectionFinder } from "../../SectionMetas/baseSectionTypes";
import { FeNameInfo } from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { ChildFeInfo } from "../../SectionMetas/relSectionTypes/ChildTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import { InitSectionOptions } from "./addSectionAndSolve";
import { internal } from "./internal";

type ResetSectionOptions = Omit<InitSectionOptions, "idx"> & {
  resetDbIds?: boolean;
};
function resetSection<S extends SectionName<"hasParent">>(
  next: Analyzer,
  info: SectionFinder<S>,
  { resetDbIds = false, ...options }: ResetSectionOptions = {}
): Analyzer {
  const feInfo = next.section(info).feInfo as FeNameInfo<S>;
  const parent = next.parent(feInfo);
  const idx = parent.childIdx(
    feInfo as any as ChildFeInfo<typeof parent.sectionName>
  );

  next = internal.eraseSectionAndChildren(next, feInfo);

  const { sectionName } = feInfo;
  next = internal.addSections(next, {
    sectionName,
    parentFinder: parent.feInfo,
    ...options,
    idx,
  });

  if (resetDbIds) {
    const { feInfo: newFeInfo } = next.lastSection(sectionName);
    next = internal.resetSectionAndChildDbIds(next, newFeInfo);
  }
  return next;
}

export function resetSectionAndSolve(
  this: Analyzer,
  finder: SectionFinder<SectionName<"hasParent">>,
  options: ResetSectionOptions = {}
): Analyzer {
  const next = resetSection(this, finder, options);
  return next.solveVarbs();
}
