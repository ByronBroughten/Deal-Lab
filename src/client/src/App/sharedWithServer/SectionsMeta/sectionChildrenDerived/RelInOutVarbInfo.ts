import { VarbAbsoluteInfoMixed } from "../SectionInfo/AbsolutePathInfo";
import {
  RelChildrenVarbInfo,
  RelLocalVarbInfo,
  RelNiblingOfChildVarbInfo,
  RelParentVarbInfo,
  RelPiblingVarbInfo,
  RelStepSiblingOfChildVarbInfo,
  RelStepSiblingVarbInfo,
} from "../SectionInfo/RelVarbInfo";
import { SectionName } from "../SectionName";

export type PathInVarbInfo<SN extends SectionName = SectionName> =
  | RelInVarbInfo<SN>
  | VarbAbsoluteInfoMixed<SN, "onlyOne">;

export type RelInVarbInfo<SN extends SectionName = SectionName> =
  | RelLocalVarbInfo
  | RelChildrenVarbInfo<SN>
  | RelStepSiblingVarbInfo<SN>
  | RelPiblingVarbInfo<SN>;

export type RelOutVarbInfo =
  | RelLocalVarbInfo
  | RelParentVarbInfo
  | RelStepSiblingOfChildVarbInfo
  | RelNiblingOfChildVarbInfo;
