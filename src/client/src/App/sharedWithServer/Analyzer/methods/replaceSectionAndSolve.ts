import Analyzer from "../../Analyzer";
import { ChildFeInfo } from "../SectionMetas/relNameArrs/ChildTypes";
import { SectionFinder } from "../SectionMetas/relSections/baseSectionTypes";
import { SectionName } from "../SectionMetas/SectionName";
import { SectionPackRaw } from "../SectionPackRaw";
import { internal } from "./internal";

export function replaceSectionAndSolve<SN extends SectionName<"hasParent">>(
  this: Analyzer,
  finder: SectionFinder<SN>,
  replacementSectionPack: SectionPackRaw<"fe", SN>
): Analyzer {
  const next = replaceSection(this, finder, replacementSectionPack);
  return next.solveVarbs();
}
function replaceSection<SN extends SectionName<"hasParent">>(
  next: Analyzer,
  finder: SectionFinder<SN>,
  replacementSectionPack: SectionPackRaw<"fe", SN>
): Analyzer {
  const feInfo = next.sectionInfo(finder);
  const parent = next.parent(feInfo);
  const idx = parent.childIdx(feInfo as ChildFeInfo<typeof parent.sectionName>);

  next = internal.eraseSectionAndChildren(next, feInfo);
  return next.loadRawSectionPack(replacementSectionPack, {
    idx,
    parentFinder: parent.feInfo,
  });
}
