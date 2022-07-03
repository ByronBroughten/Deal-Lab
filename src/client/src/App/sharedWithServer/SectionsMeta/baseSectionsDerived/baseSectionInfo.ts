import { SimpleSectionName } from "../baseSections";
import { DbIdInfo, FeIdInfo } from "../baseSectionsUtils/baseIdInfo";

export interface SectionNameProp<SN extends SimpleSectionName> {
  sectionName: SN;
}

export interface FeMixedInfo<SN extends SimpleSectionName = SimpleSectionName>
  extends FeIdInfo,
    SectionNameProp<SN> {}

export interface DbMixedInfo<SN extends SimpleSectionName = SimpleSectionName>
  extends DbIdInfo,
    SectionNameProp<SN> {}

// Fe and Db MixedInfo used to both have SN extends "no parent"; that should
// be unnecessary now.
