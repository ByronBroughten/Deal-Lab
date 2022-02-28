import Analyzer from "../../../Analyzer";
import { FeInfo } from "../../SectionMetas/Info";
import { StateSectionCore } from "../../StateSection";

export function updateSection<I extends FeInfo>(
  this: Analyzer,
  feInfo: I,
  nextBaseProps: Partial<StateSectionCore<I["sectionName"]>>
): Analyzer {
  const section = this.section(feInfo);
  const nextSection = section.update(nextBaseProps);
  return this.replaceInSectionArr(nextSection);
}
