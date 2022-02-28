import Analyzer from "../../../Analyzer";
import { sectionNotFound } from "./section";
import {
  DbNameInfo,
  DbVarbInfo,
  FeNameInfo,
  FeVarbInfo,
  MultiVarbInfo,
  SpecificSectionInfo,
} from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../../SectionMetas/SectionName";

export function feInfo<S extends SectionName<"alwaysOne">>(
  this: Analyzer,
  sectionName: S
): FeNameInfo<S> {
  return this.section(sectionName).feInfo;
}

export function varbInfosByFocal<S extends SectionName>(
  this: Analyzer,
  focalInfo: SpecificSectionInfo<S>,
  info: MultiVarbInfo
): FeVarbInfo[] {
  const infosOrUn = this.findVarbInfosByFocal(focalInfo, info);
  if (infosOrUn) return infosOrUn;
  else throw sectionNotFound(info);
}

export function feToDbInfo<I extends FeNameInfo | FeVarbInfo>(
  this: Analyzer,
  feInfo: I
): I extends FeVarbInfo ? DbVarbInfo : DbNameInfo {
  return {
    ...feInfo,
    ...this.section(feInfo).dbInfo,
  };
}
