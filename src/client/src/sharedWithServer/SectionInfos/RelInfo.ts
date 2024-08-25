import { ChildName } from "../stateSchemas/derivedFromChildrenSchemas/ChildName";
import {
  ParentName,
  PiblingName,
  StepSiblingName,
} from "../stateSchemas/derivedFromChildrenSchemas/ParentName";
import { SectionName } from "../stateSchemas/SectionName";
import { MixedInfoProps } from "./VarbInfoBase";

export type RelInfoType =
  | "local" // local
  | "parent"
  | "stepSibling" // stepSiblingIfOfChildName
  | "pibling" // niblingIfOfHasChildName
  // "nibling" — nibling might be hard
  | "children" // parent
  | "firstChild"
  | "stepSiblingOfHasChildName"
  | "niblingIfOfHasChildName";

type RelInfoTypeTest<T extends RelSectionInfo["infoType"]> = T;
type _TestRelInfoType = RelInfoTypeTest<RelInfoType>;

export type RelSectionInfo =
  | RelLocalInfo
  | RelParentInfo
  | RelChildrenInfo
  | RelFirstChildInfo
  | RelStepSiblingInfo
  | RelPiblingInfo
  | RelStepSiblingOfChildInfo
  | RelNiblingOfChildInfo;

type RelSectionInfoTest<T extends RelInfoType> = T;
type _TestRelSectionInfo = RelSectionInfoTest<RelSectionInfo["infoType"]>;

interface RelInfoMixed extends MixedInfoProps<RelInfoType> {}

export interface RelLocalInfo extends RelInfoMixed {
  infoType: "local";
}

export interface RelParentInfo<
  SN extends SectionName = SectionName,
  PN extends ParentName<SN> = ParentName<SN>
> extends RelInfoMixed {
  infoType: "parent";
  parentName: PN;
}

export interface RelFirstChildInfo<
  SN extends SectionName = SectionName,
  CN extends ChildName<SN> = ChildName<SN>
> extends RelInfoMixed {
  infoType: "firstChild";
  childName: CN;
}

export interface RelChildrenInfo<
  SN extends SectionName = SectionName,
  CN extends ChildName<SN> = ChildName<SN>
> extends RelInfoMixed {
  infoType: "children";
  childName: CN;
}
export interface RelStepSiblingInfo<
  SN extends SectionName = SectionName,
  SSN extends StepSiblingName<SN> = StepSiblingName<SN>,
  SSSN extends SectionName = SectionName
> extends RelInfoMixed {
  infoType: "stepSibling";
  stepSiblingName: SSN;
  stepSiblingSectionName: SSSN;
}
export interface RelPiblingInfo<
  SN extends SectionName = SectionName,
  PN extends PiblingName<SN> = PiblingName<SN>,
  PSN extends SectionName = SectionName
> extends RelInfoMixed {
  infoType: "pibling";
  piblingName: PN;
  piblingSectionName: PSN;
}

export interface RelStepSiblingOfChildInfo<
  SSN extends SectionName = SectionName,
  CN extends ChildName = ChildName
> extends RelInfoMixed {
  infoType: "stepSiblingOfHasChildName";
  stepSiblingSectionName: SSN;
  selfChildName: CN;
}
export interface RelNiblingOfChildInfo<
  NSN extends SectionName = SectionName,
  CN extends ChildName = ChildName
> extends RelInfoMixed {
  infoType: "niblingIfOfHasChildName";
  selfChildName: CN;
  niblingSectionName: NSN;
}
