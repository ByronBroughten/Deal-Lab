import Analyzer from "../../../../Analyzer";
import { FeInfo, Inf } from "../../../../SectionMetas/Info";
import { SectionName } from "../../../../SectionMetas/SectionName";
import StateSection from "../../../StateSection";
import { InitStateSectionProps } from "../../../StateSectionOld";

function insertInParentChildIds(
  next: Analyzer,
  feInfo: FeInfo<"hasParent">,
  idx: number
) {
  const nextParent = next.parent(feInfo).insertChildFeId(feInfo, idx);
  return next.updateSection(nextParent);
}
function pushToParentChildIds(next: Analyzer, feInfo: FeInfo<"hasParent">) {
  const nextParent = next.parent(feInfo).pushChildFeId(feInfo);
  return next.updateSection(nextParent);
}
function addToParentChildIds(
  analyzer: Analyzer,
  feInfo: FeInfo,
  idx?: number
): Analyzer {
  if (!Inf.is.fe(feInfo, "hasParent")) return analyzer;
  const parentSection = analyzer.parent(feInfo);
  const nextParent = parentSection.addChildFeId(feInfo, idx);
  return analyzer.updateSection(nextParent);
} // will this still use StateSectionOld? I think so.
function pushSection<S extends SectionName>(
  analyzer: Analyzer,
  section: StateSection<S>
): Analyzer {
  const { sectionName } = section;
  const nextSectionArr = [
    ...analyzer.sectionArr(sectionName),
    section,
  ] as any as StateSection[];
  return analyzer.updateSectionArr(sectionName as SectionName, nextSectionArr);
}

export type InitOneSectionProps<S extends SectionName = SectionName> =
  InitStateSectionProps<S> & {
    idx?: number;
  };
export function initOneSection<S extends SectionName>(
  next: Analyzer,
  { idx, ...props }: InitOneSectionProps<S>
): Analyzer {
  next = pushSection(next, StateSection.init(props));
  const { feInfo } = next.lastSection(props.sectionName);
  if (Inf.is.fe(feInfo, "hasParent")) {
    if (typeof idx === "number")
      next = insertInParentChildIds(next, feInfo, idx);
    else next = pushToParentChildIds(next, feInfo);
  }
  return next;
}
