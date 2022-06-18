import {
  FeInfo,
  InfoS,
} from "../../../../../../App/sharedWithServer/SectionsMeta/Info";
import { SectionName } from "../../../../../../App/sharedWithServer/SectionsMeta/SectionName";
import Analyzer from "../../../../Analyzer";
import StateSection from "../../../StateSection";
import { InitStateSectionProps } from "../../../StateSectionOld";

function insertInParentChildIds(
  next: Analyzer,
  feInfo: FeInfo<"hasParent">,
  idx: number
) {
  const nextParent = next.parent(feInfo).insertChildFeId(feInfo, idx);
  return next.updateSection(nextParent as StateSection);
}
function pushToParentChildIds(next: Analyzer, feInfo: FeInfo<"hasParent">) {
  const nextParent = next.parent(feInfo).pushChildFeId(feInfo);
  return next.updateSection(nextParent as StateSection);
}
function addToParentChildIds(
  analyzer: Analyzer,
  feInfo: FeInfo,
  idx?: number
): Analyzer {
  if (!InfoS.is.fe(feInfo, "hasParent")) return analyzer;
  const parentSection = analyzer.parent(feInfo);
  const nextParent = parentSection.addChildFeId(feInfo, idx);
  return analyzer.updateSection(nextParent as StateSection);
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
  if (InfoS.is.fe(feInfo, "hasParent")) {
    if (typeof idx === "number")
      next = insertInParentChildIds(next, feInfo, idx);
    else next = pushToParentChildIds(next, feInfo);
  }
  return next;
}
