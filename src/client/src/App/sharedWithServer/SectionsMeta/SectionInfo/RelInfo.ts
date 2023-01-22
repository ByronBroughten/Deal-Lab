import {
  ExpectedCount,
  GeneralMixedInfo,
} from "../allBaseSectionVarbs/NanoIdInfo";
import { ChildName } from "../sectionChildrenDerived/ChildName";
import {
  ParentName,
  PiblingName,
  StepSiblingName,
} from "../sectionChildrenDerived/ParentName";
import { SectionName } from "../SectionName";

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

interface RelInfoMixed<EC extends ExpectedCount> extends GeneralMixedInfo {
  infoType: RelInfoType;
  expectedCount: EC;
}

export interface RelLocalInfo extends RelInfoMixed<"onlyOne"> {
  infoType: "local";
}
export interface RelParentInfo<
  SN extends SectionName = SectionName,
  PN extends ParentName<SN> = ParentName<SN>
> extends RelInfoMixed<"onlyOne"> {
  infoType: "parent";
  parentName: PN;
}
export interface RelChildrenInfo<
  SN extends SectionName = SectionName,
  CN extends ChildName<SN> = ChildName<SN>,
  OO extends ExpectedCount = ExpectedCount
> extends RelInfoMixed<OO> {
  infoType: "children";
  childName: CN;
}
export interface RelStepSiblingInfo<
  SN extends SectionName = SectionName,
  SSN extends StepSiblingName<SN> = StepSiblingName<SN>,
  SSSN extends SectionName = SectionName,
  OO extends ExpectedCount = ExpectedCount
> extends RelInfoMixed<OO> {
  infoType: "stepSibling";
  stepSiblingName: SSN;
  stepSiblingSectionName: SSSN;
}
export interface RelPiblingInfo<
  SN extends SectionName = SectionName,
  PN extends PiblingName<SN> = PiblingName<SN>,
  PSN extends SectionName = SectionName,
  OO extends ExpectedCount = ExpectedCount
> extends RelInfoMixed<OO> {
  infoType: "pibling";
  piblingName: PN;
  piblingSectionName: PSN;
}

export interface RelStepSiblingOfChildInfo<
  SSN extends SectionName = SectionName,
  CN extends ChildName = ChildName,
  OO extends ExpectedCount = ExpectedCount
> extends RelInfoMixed<OO> {
  infoType: "stepSiblingOfHasChildName";
  stepSiblingSectionName: SSN;
  selfChildName: CN;
}
export interface RelNiblingOfChildInfo<
  NSN extends SectionName = SectionName,
  CN extends ChildName = ChildName,
  OO extends ExpectedCount = ExpectedCount
> extends RelInfoMixed<OO> {
  // if it's childName is a match
  // It looks through all its step siblings' children
  // if it finds children that are of the right sectionName
  // it adds its outUpdateInfo to those
  infoType: "niblingIfOfHasChildName";
  selfChildName: CN;
  niblingSectionName: NSN;
}
