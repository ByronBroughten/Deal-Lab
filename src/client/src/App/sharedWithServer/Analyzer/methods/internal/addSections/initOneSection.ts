import Analyzer from "../../../../Analyzer";
import { FeInfo, Inf } from "../../../SectionMetas/Info";
import { SectionName } from "../../../SectionMetas/SectionName";
import StateSection from "../../../StateSection";
import { AddSectionProps } from "./addSectionsTypes";

function insertInParentChildIds(
  next: Analyzer,
  feInfo: FeInfo<"hasParent">,
  idx: number
) {
  const nextParent = next.parent(feInfo).insertChildFeId(feInfo, idx);
  return next.replaceInSectionArr(nextParent);
}
function pushToParentChildIds(next: Analyzer, feInfo: FeInfo<"hasParent">) {
  const nextParent = next.parent(feInfo).pushChildFeId(feInfo);
  return next.replaceInSectionArr(nextParent);
}

function pushSection<S extends SectionName>(
  analyzer: Analyzer,
  section: StateSection<S>
): Analyzer {
  const sectionName = section.meta.get("sectionName");
  const nextSectionArr = [
    ...analyzer.sections[sectionName],
    section,
  ] as StateSection[];
  return analyzer.updateSectionArr(sectionName, nextSectionArr);
}

export function initOneSection(
  next: Analyzer,
  { idx, ...props }: AddSectionProps
): Analyzer {
  const newSection = StateSection.init(props);
  next = pushSection(next, newSection);

  if (Inf.is.fe(newSection.feInfo, "hasParent")) {
    if (typeof idx === "number")
      next = insertInParentChildIds(next, newSection.feInfo, idx);
    else next = pushToParentChildIds(next, newSection.feInfo);
  }
  return next;
}
