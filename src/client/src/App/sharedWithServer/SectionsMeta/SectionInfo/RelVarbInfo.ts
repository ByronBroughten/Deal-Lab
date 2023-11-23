import { Obj } from "../../utils/Obj";
import { VarbNameWide } from "../baseSectionsDerived/baseSectionsVarbsTypes";
import { ChildName } from "../sectionChildrenDerived/ChildName";
import {
  ParentName,
  PiblingName,
  StepSiblingName,
} from "../sectionChildrenDerived/ParentName";
import { SectionName } from "../SectionName";
import {
  RelChildrenInfo,
  RelFirstChildInfo,
  RelInfoType,
  RelLocalInfo,
  RelNiblingOfChildInfo,
  RelParentInfo,
  RelPiblingInfo,
  RelStepSiblingInfo,
  RelStepSiblingOfChildInfo,
} from "./RelInfo";
import { VarbProp } from "./VarbInfoBase";

export type RelVarbInfo =
  | RelChildrenVarbInfo
  | RelFirstChildVarbInfo
  | RelParentVarbInfo
  | RelLocalVarbInfo
  | RelStepSiblingVarbInfo
  | RelPiblingVarbInfo
  | RelStepSiblingOfChildVarbInfo
  | RelNiblingOfChildVarbInfo;

type RelVarbInfoTest<T extends RelInfoType> = T;
type _TestRelSectionInfo = RelVarbInfoTest<RelVarbInfo["infoType"]>;

export interface RelLocalVarbInfo extends RelLocalInfo, VarbProp {}
export interface RelParentVarbInfo<
  SN extends SectionName = SectionName,
  PN extends ParentName<SN> = ParentName<SN>
> extends RelParentInfo<SN, PN>,
    VarbProp {}

export interface RelFirstChildVarbInfo<
  SN extends SectionName = SectionName,
  CN extends ChildName<SN> = ChildName<SN>
> extends RelFirstChildInfo<SN, CN>,
    VarbProp {}

export interface RelChildrenVarbInfo<
  SN extends SectionName = SectionName,
  CN extends ChildName<SN> = ChildName<SN>
> extends RelChildrenInfo<SN, CN>,
    VarbProp {}

export interface RelStepSiblingVarbInfo<
  SN extends SectionName = SectionName,
  SSN extends StepSiblingName<SN> = StepSiblingName<SN>,
  SSSN extends SectionName = SectionName
> extends RelStepSiblingInfo<SN, SSN, SSSN>,
    VarbProp {}
export interface RelPiblingVarbInfo<
  SN extends SectionName = SectionName,
  PN extends PiblingName<SN> = PiblingName<SN>,
  PSN extends SectionName = SectionName
> extends RelPiblingInfo<SN, PN, PSN>,
    VarbProp {}

export interface RelStepSiblingOfChildVarbInfo<
  SSSN extends SectionName = SectionName,
  CN extends ChildName = ChildName
> extends RelStepSiblingOfChildInfo<SSSN, CN> {
  varbName: string;
}
export interface RelNiblingOfChildVarbInfo<
  NSN extends SectionName = SectionName,
  CN extends ChildName = ChildName
> extends RelNiblingOfChildInfo<NSN, CN> {
  varbName: string;
}

export const relVarbInfoS = {
  isLocal(value: any): value is RelLocalVarbInfo {
    return (
      Obj.isObjToAny(value) &&
      value.infoType === "local" &&
      typeof value.varbName === "string"
    );
  },
  local(varbName: VarbNameWide): RelLocalVarbInfo {
    return {
      infoType: "local",
      varbName,
    };
  },
  localBase(varbName: string): RelLocalVarbInfo {
    return {
      infoType: "local",
      varbName,
    };
  },
  children<SN extends SectionName, CN extends ChildName<SN>>(
    childName: CN,
    varbName: string
  ): RelChildrenVarbInfo<SN, CN> {
    return {
      infoType: "children",
      childName,
      varbName,
    };
  },
  onlyChild<SN extends SectionName, CN extends ChildName<SN>>(
    childName: CN,
    varbName: string
  ): RelChildrenVarbInfo<SN, CN> {
    return {
      infoType: "children",
      childName,
      varbName,
    };
  },
  firstChild<SN extends SectionName, CN extends ChildName<SN>>(
    childName: CN,
    varbName: string
  ): RelFirstChildVarbInfo<SN, CN> {
    return {
      infoType: "firstChild",
      childName,
      varbName,
    };
  },
  stepSibling<
    SN extends SectionName,
    SSN extends StepSiblingName<SN>,
    SSSN extends SectionName
  >(
    stepSiblingName: SSN,
    stepSiblingSectionName: SSSN,
    varbName: string
  ): RelStepSiblingVarbInfo<SN, SSN, SSSN> {
    return {
      infoType: "stepSibling",
      stepSiblingName,
      stepSiblingSectionName,
      varbName,
    };
  },
};

export const rviS = relVarbInfoS;
