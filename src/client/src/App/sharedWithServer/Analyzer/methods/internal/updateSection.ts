import Analyzer from "../../../Analyzer";
import { FeNameInfo } from "../../../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { StateSectionCore } from "../../StateSection";

export function updateSection<I extends FeNameInfo>(
  analyzer: Analyzer,
  feInfo: I,
  nextBaseProps: Partial<StateSectionCore<I["sectionName"]>>
): Analyzer {
  const section = analyzer.section(feInfo);
  const nextSection = section.update(nextBaseProps);
  return analyzer.updateSection(nextSection);
}
