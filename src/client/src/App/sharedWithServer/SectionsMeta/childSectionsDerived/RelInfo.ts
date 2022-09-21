import { ExpectedCount, GeneralInfo } from "../baseSectionsVarbs/NanoIdInfo";
import { SectionName } from "../SectionName";
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
  SN extends SectionName = SectionName,
  PN extends ParentName<SN> = ParentName<SN>
> extends RelInfo<"onlyOne"> {
  infoType: "parent";
  parentName: PN;
}
export interface RelChildrenInfo<
  SN extends SectionName = SectionName,
  CN extends ChildName<SN> = ChildName<SN>,
  OO extends ExpectedCount = ExpectedCount
> extends RelInfo<OO> {
  infoType: "children";
  childName: CN;
}
export interface RelStepSiblingInfo<
  SN extends SectionName = SectionName,
  SSN extends StepSiblingName<SN> = StepSiblingName<SN>,
  SSSN extends SectionName = SectionName,
  OO extends ExpectedCount = ExpectedCount
> extends RelInfo<OO> {
  infoType: "stepSibling";
  stepSiblingName: SSN;
  stepSiblingSectionName: SSSN;
}
export interface RelPiblingInfo<
  SN extends SectionName = SectionName,
  PN extends PiblingName<SN> = PiblingName<SN>,
  PSN extends SectionName = SectionName,
  OO extends ExpectedCount = ExpectedCount
> extends RelInfo<OO> {
  infoType: "pibling";
  piblingName: PN;
  piblingSectionName: PSN;
}

export interface RelStepSiblingOfChildInfo<
  SSN extends SectionName = SectionName,
  CN extends ChildName = ChildName,
  OO extends ExpectedCount = ExpectedCount
> extends RelInfo<OO> {
  infoType: "stepSiblingOfHasChildName";
  stepSiblingSectionName: SSN;
  selfChildName: CN;
}
export interface RelNiblingOfChildInfo<
  NSN extends SectionName = SectionName,
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
