import Analyzer from "../../../Analyzer";
import { FeInfo } from "../../SectionMetas/Info";

export function resetSectionAndChildDbIds(
  this: Analyzer,
  feInfo: FeInfo
): Analyzer {
  const feInfos = this.nestedFeInfos(feInfo);
  const next = feInfos.reduce((next, info) => {
    return next.updateSection(info, {
      dbId: Analyzer.makeId(),
    });
  }, this);
  return next;
}
