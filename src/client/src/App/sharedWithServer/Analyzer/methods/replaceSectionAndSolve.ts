import Analyzer from "../../Analyzer";
import { SectionPackRaw } from "../../SectionPack/SectionPackRaw";
import { SectionFinder } from "../../SectionsMeta/baseSectionTypes";
import { FeNameInfo } from "../../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { ChildFeInfo } from "../../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../../SectionsMeta/SectionName";
import { internal } from "./internal";

export function replaceSectionAndSolve<SN extends SectionName<"hasParent">>(
  this: Analyzer,
  finder: SectionFinder<SN>,
  replacementSectionPack: SectionPackRaw<SN>
): Analyzer {
  const next = replaceSection(this, finder, replacementSectionPack);
  return next.solveVarbs();
}
function replaceSection<SN extends SectionName<"hasParent">>(
  next: Analyzer,
  finder: SectionFinder<SN>,
  replacementSectionPack: SectionPackRaw<SN>
): Analyzer {
  const feInfo = next.sectionInfo(finder);
  const parent = next.parent(feInfo);
  const idx = parent.childIdx(
    feInfo as FeNameInfo as ChildFeInfo<typeof parent.sectionName>
  );

  next = internal.eraseSectionAndChildren(next, feInfo);
  return next.loadRawSectionPack(replacementSectionPack, {
    idx,
    parentInfo: parent.feInfo,
  });
}
