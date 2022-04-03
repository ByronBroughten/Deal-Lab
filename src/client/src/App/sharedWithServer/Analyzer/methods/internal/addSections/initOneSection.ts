import Analyzer from "../../../../Analyzer";
import { FeInfo, Inf } from "../../../SectionMetas/Info";
import { SectionName } from "../../../SectionMetas/SectionName";
import StateSection, { InitStateSectionProps } from "../../../StateSection";
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

function addToParentChildIds(
  analyzer: Analyzer,
  feInfo: FeInfo,
  idx?: number
): Analyzer {
  if (!Inf.is.fe(feInfo, "hasParent")) return analyzer;

  const parentSection = analyzer.parent(feInfo);
  const nextParent = parentSection.addChildFeId(feInfo, idx);
  return analyzer.replaceInSectionArr(nextParent);
}
function pushSection<S extends SectionName>(
  analyzer: Analyzer,
  section: StateSection<S>
): Analyzer {
  const { sectionName } = section.meta;
  const nextSectionArr = [
    ...analyzer.sections[sectionName],
    section,
  ] as StateSection[];
  return analyzer.updateSectionArr(sectionName, nextSectionArr);
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

// export function nextInitOneSection<S extends SectionName>(
//   next: Analyzer,
//   { idx, ...props }: AddSectionProps
// ): Analyzer {
//   const newSection = StateSection.
// }
