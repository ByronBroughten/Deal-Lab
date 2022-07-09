import { SimpleSectionName } from "../baseSections";
import { ExpectedCount, GeneralInfo } from "../baseSectionsUtils/NanoIdInfo";
import { ChildName } from "./ChildName";
import { ParentName, PiblingName, StepSiblingName } from "./ParentName";

export type RelInfoType =
  | "local" // local
  | "parent"
  | "stepSibling" // stepSiblingIfOfChildName
  | "pibling" // niblingIfOfHasChildName
  // "nibling" — nibling might be hard
  | "children" // parent
  | "stepSiblingOfHasChildName"
  | "niblingIfOfHasChildName";

type RelInfoTypeTest<T extends RelSectionInfo["infoType"]> = T;
type _TestRelInfoType = RelInfoTypeTest<RelInfoType>;

export type RelSectionInfo =
  | RelLocalInfo
  | RelParentInfo
  | RelChildrenInfo
  | RelStepSiblingInfo
  | RelPiblingInfo
  | RelStepSiblingOfChildInfo
  | RelNiblingOfChildInfo;

type RelSectionInfoTest<T extends RelInfoType> = T;
type _TestRelSectionInfo = RelSectionInfoTest<RelSectionInfo["infoType"]>;

interface RelInfo<OO extends ExpectedCount> extends GeneralInfo {
  infoType: RelInfoType;
  expectedCount: OO;
}

export interface RelLocalInfo extends RelInfo<"onlyOne"> {
  infoType: "local";
}
export interface RelParentInfo<
  SN extends SimpleSectionName = SimpleSectionName,
  PN extends ParentName<SN> = ParentName<SN>
> extends RelInfo<"onlyOne"> {
  infoType: "parent";
  parentName: PN;
}
export interface RelChildrenInfo<
  SN extends SimpleSectionName = SimpleSectionName,
  CN extends ChildName<SN> = ChildName<SN>,
  OO extends ExpectedCount = ExpectedCount
> extends RelInfo<OO> {
  infoType: "children";
  childName: CN;
}
export interface RelStepSiblingInfo<
  SN extends SimpleSectionName = SimpleSectionName,
  SSN extends StepSiblingName<SN> = StepSiblingName<SN>,
  SSSN extends SimpleSectionName = SimpleSectionName,
  OO extends ExpectedCount = ExpectedCount
> extends RelInfo<OO> {
  infoType: "stepSibling";
  stepSiblingName: SSN;
  stepSiblingSectionName: SSSN;
}
export interface RelPiblingInfo<
  SN extends SimpleSectionName = SimpleSectionName,
  PN extends PiblingName<SN> = PiblingName<SN>,
  PSN extends SimpleSectionName = SimpleSectionName,
  OO extends ExpectedCount = ExpectedCount
> extends RelInfo<OO> {
  infoType: "pibling";
  piblingName: PN;
  piblingSectionName: PSN;
}

export interface RelStepSiblingOfChildInfo<
  SSN extends SimpleSectionName = SimpleSectionName,
  CN extends ChildName = ChildName,
  OO extends ExpectedCount = ExpectedCount
> extends RelInfo<OO> {
  infoType: "stepSiblingOfHasChildName";
  stepSiblingSectionName: SSN;
  selfChildName: CN;
}
export interface RelNiblingOfChildInfo<
  NSN extends SimpleSectionName = SimpleSectionName,
  CN extends ChildName = ChildName,
  OO extends ExpectedCount = ExpectedCount
> extends RelInfo<OO> {
  // if it's childName is a match
  // It looks through all its step siblings' children
  // if it finds children that are of the right sectionName
  // it adds its outUpdateInfo to those
  infoType: "niblingIfOfHasChildName";
  selfChildName: CN;
  niblingSectionName: NSN;
}
