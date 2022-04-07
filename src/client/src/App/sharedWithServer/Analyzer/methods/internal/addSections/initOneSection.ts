import Analyzer from "../../../../Analyzer";
import { FeInfo, Inf } from "../../../SectionMetas/Info";
import { SectionName } from "../../../SectionMetas/SectionName";
import StateSection from "../../../StateSection";
import { AddSectionProps } from "./addSectionsTypes";

export function initOneSection(
  next: Analyzer,
  { idx, ...props }: AddSectionProps
): Analyzer {
  next = makeSection(next, props);
  return addNewSectionToParent(next, props.sectionName, idx);
}

function makeSection(
  next: Analyzer,
  { parentFinder, ...props }: Omit<AddSectionProps, "idx">
) {
  const parentInfo = next.parentFinderToInfo(props.sectionName, parentFinder);
  const newSection = StateSection.init({ ...props, parentInfo });
  return pushSection(next, newSection);
}

function addNewSectionToParent(
  next: Analyzer,
  sectionName: SectionName,
  idx?: number
): Analyzer {
  const { feInfo: newFeInfo } = next.lastSection(sectionName);
  if (Inf.is.fe(newFeInfo, "hasParent")) {
    if (typeof idx === "number")
      next = insertInParentChildIds(next, newFeInfo, idx);
    else next = pushToParentChildIds(next, newFeInfo);
  }
  return next;
}

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
