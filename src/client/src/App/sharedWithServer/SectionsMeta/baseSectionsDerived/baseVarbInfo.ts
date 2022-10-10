import { Obj } from "../../utils/Obj";
import { baseSectionsVarbs } from "../baseSectionsVarbs";
import {
  DbIdInfo,
  ExpectedCount,
  FeIdInfo,
  GeneralInfo,
} from "../baseSectionsVarbs/NanoIdInfo";
import { SectionName } from "../SectionName";
import { SectionNameProp } from "./baseSectionInfo";
import { VarbName } from "./baseSectionsVarbsTypes";

export interface ActiveDealInfo<
  SN extends SectionName = SectionName,
  EC extends ExpectedCount = ExpectedCount
> extends GeneralInfo,
    SectionNameProp<SN> {
  infoType: "activeDeal";
  expectedCount: EC;
}

export interface GlobalSectionInfo<
  SN extends SectionName = SectionName,
  EC extends ExpectedCount = ExpectedCount
> extends GeneralInfo,
    SectionNameProp<SN> {
  infoType: "globalSection";
  expectedCount: EC;
}
export interface GlobalVarbInfo<
  SN extends SectionName = SectionName,
  EC extends ExpectedCount = ExpectedCount
> extends GlobalSectionInfo<SN, EC>,
    VarbProp {}

export interface DbSectionInfoMixed<
  SN extends SectionName = SectionName,
  EC extends ExpectedCount = ExpectedCount
> extends DbIdInfo,
    SectionNameProp<SN> {
  expectedCount: EC;
}
export interface DbVarbInfoMixed<
  SN extends SectionName = SectionName,
  EC extends ExpectedCount = ExpectedCount
> extends DbSectionInfoMixed<SN, EC>,
    VarbProp {}

export interface FeSectionInfoMixed<SN extends SectionName = SectionName>
  extends FeIdInfo,
    SectionNameProp<SN> {
  expectedCount: "onlyOne";
}
export interface FeVarbInfoMixed<SN extends SectionName = SectionName>
  extends FeSectionInfoMixed<SN>,
    VarbProp {}

export type VarbProp = { varbName: string };
export function isVarbName(value: any): value is string {
  return typeof value === "string";
}

export type VarbPropNext<
  SN extends SectionName,
  VN extends VarbName<SN> = VarbName<SN>
> = {
  varbName: VN;
};
export interface VarbNamesNext<
  SN extends SectionName,
  VN extends VarbName<SN> = VarbName<SN>
> extends SectionNameProp<SN>,
    VarbPropNext<SN, VN> {}

export interface VarbNames<SN extends SectionName = SectionName>
  extends SectionNameProp<SN>,
    VarbProp {}

export function isValidVarbNames({ sectionName, varbName }: VarbNames) {
  const varbNames = Obj.keys(baseSectionsVarbs[sectionName]) as string[];
  if (varbNames.includes(varbName)) return true;
  else return false;
}
