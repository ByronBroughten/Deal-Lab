import Analyzer from "../../../Analyzer";
import {
  FeVarbInfo,
  MultiVarbInfo,
  SpecificSectionInfo,
} from "../../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../../../SectionMetas/SectionName";
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
