import Analyzer from "../../Analyzer";
import {
  FeNameInfo,
  FeVarbInfo,
} from "../SectionMetas/relSections/rel/relVarbInfoTypes";

export function copySection(
  this: Analyzer,
  feInfo: FeNameInfo,
  titleVarbName: string = "title"
): Analyzer {
  let next = this;
  const varbInfo = { ...feInfo, varbName: titleVarbName } as FeVarbInfo;
  const nextTitle = next.value(varbInfo, "string") + " copy";
  next = next.directUpdateAndSolve(varbInfo, nextTitle);
  return next.resetSectionAndChildDbIds(feInfo);
}
