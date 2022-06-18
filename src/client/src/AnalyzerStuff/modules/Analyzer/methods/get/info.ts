import {
  FeVarbInfo,
  MultiVarbInfo,
  SpecificSectionInfo,
} from "../../../../../App/sharedWithServer/SectionsMeta/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../../../../../App/sharedWithServer/SectionsMeta/SectionName";
import Analyzer from "../../../Analyzer";
import { sectionNotFound } from "./section";

export function varbInfosByFocal<S extends SectionName>(
  this: Analyzer,
  focalInfo: SpecificSectionInfo<S>,
  info: MultiVarbInfo
): FeVarbInfo[] {
  const infosOrUn = this.findVarbInfosByFocal(focalInfo, info);
  if (infosOrUn) return infosOrUn;
  else throw sectionNotFound(info);
}
