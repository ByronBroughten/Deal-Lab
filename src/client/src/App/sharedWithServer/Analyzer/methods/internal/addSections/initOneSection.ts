import Analyzer from "../../../../Analyzer";
import { FeInfo, Inf } from "../../../SectionMetas/Info";
import { SectionNam, SectionName } from "../../../SectionMetas/SectionName";
import StateSection, { InitStateSectionProps } from "../../../StateSection";

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
  analyzer: Analyzer,
  { idx, ...props }: InitOneSectionProps<S>
): Analyzer {
  let next = analyzer;
  next = pushSection(next, StateSection.init(props));

  const { sectionName } = props;
  const { feInfo } = next.lastSection(sectionName);
  if (SectionNam.is(sectionName, "hasParent"))
    next = addToParentChildIds(next, feInfo, idx);
  return next;
}
