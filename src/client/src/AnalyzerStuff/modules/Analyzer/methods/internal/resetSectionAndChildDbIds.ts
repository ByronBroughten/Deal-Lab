import { FeInfo } from "../../../../../App/sharedWithServer/SectionsMeta/Info";
import Analyzer from "../../../Analyzer";
import { internal } from "../internal";

export function resetSectionAndChildDbIds(
  this: Analyzer,
  feInfo: FeInfo
): Analyzer {
  const feInfos = this.nestedFeInfos(feInfo);
  const next = feInfos.reduce((next, info) => {
    return internal.updateSection(next, info, {
      dbId: Analyzer.makeId(),
    });
  }, this);
  return next;
}
