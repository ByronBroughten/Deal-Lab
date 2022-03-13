import Analyzer from "../../../Analyzer";
import { FeInfo } from "../../SectionMetas/Info";
import { internal } from "../internal";

export function resetSectionAndChildDbIds(
  analyzer: Analyzer,
  feInfo: FeInfo
): Analyzer {
  const feInfos = analyzer.nestedFeInfos(feInfo);
  const next = feInfos.reduce((next, info) => {
    return internal.updateSection(next, info, {
      dbId: Analyzer.makeId(),
    });
  }, analyzer);
  return next;
}
