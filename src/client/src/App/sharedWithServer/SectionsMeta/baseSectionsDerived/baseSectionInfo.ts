import { SimpleSectionName } from "../baseSections";
import { DbIdInfo, FeIdInfo } from "../baseSectionsUtils/baseIdInfo";

export interface FeMixedInfo<
  SN extends SimpleSectionName | "no parent" = SimpleSectionName
> extends FeIdInfo {
  sectionName: SN;
}

export interface DbMixedInfo<
  SN extends SimpleSectionName | "no parent" = SimpleSectionName
> extends DbIdInfo {
  sectionName: SN;
}
