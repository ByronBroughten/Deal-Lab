import { Obj } from "../../utils/Obj";
import { baseSections, SimpleSectionName } from "../baseSections";
import {
  DbIdInfo,
  ExpectedCount,
  FeIdInfo,
  GeneralInfo,
} from "../baseSectionsUtils/NanoIdInfo";
import { SectionNameProp } from "./baseSectionInfo";

export interface GlobalSectionInfo<
  SN extends SimpleSectionName = SimpleSectionName,
  EC extends ExpectedCount = ExpectedCount
> extends GeneralInfo,
    SectionNameProp<SN> {
  infoType: "globalSection";
  expectedCount: EC;
}
export interface GlobalVarbInfo<
  SN extends SimpleSectionName = SimpleSectionName,
  EC extends ExpectedCount = ExpectedCount
> extends GlobalSectionInfo<SN, EC>,
    VarbProp {}

export interface DbSectionInfoMixed<
  SN extends SimpleSectionName = SimpleSectionName,
  EC extends ExpectedCount = ExpectedCount
> extends DbIdInfo,
    SectionNameProp<SN> {
  expectedCount: EC;
}
export interface DbSectionVarbInfoMixed<
  SN extends SimpleSectionName = SimpleSectionName,
  EC extends ExpectedCount = ExpectedCount
> extends DbSectionInfoMixed<SN, EC>,
    VarbProp {}

export interface FeSectionInfoMixed<
  SN extends SimpleSectionName = SimpleSectionName
> extends FeIdInfo,
    SectionNameProp<SN> {
  expectedCount: "onlyOne";
}
export interface FeVarbInfoMixed<
  SN extends SimpleSectionName = SimpleSectionName
> extends FeSectionInfoMixed<SN>,
    VarbProp {}

export type VarbProp = { varbName: string };

export interface VarbNames<SN extends SimpleSectionName = SimpleSectionName>
  extends SectionNameProp<SN>,
    VarbProp {}

export function isValidVarbNames({ sectionName, varbName }: VarbNames) {
  const varbNames = Obj.keys(
    baseSections.fe[sectionName].varbSchemas
  ) as string[];
  if (varbNames.includes(varbName)) return true;
  else return false;
}
