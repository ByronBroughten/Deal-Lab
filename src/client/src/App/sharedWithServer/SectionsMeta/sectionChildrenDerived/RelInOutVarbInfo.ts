import { PathNameVarbInfoMixed } from "../SectionInfo/PathNameInfo";
import {
  RelChildrenVarbInfo,
  RelFirstChildVarbInfo,
  RelLocalVarbInfo,
  RelNiblingOfChildVarbInfo,
  RelParentVarbInfo,
  RelPiblingVarbInfo,
  RelStepSiblingOfChildVarbInfo,
  RelStepSiblingVarbInfo,
} from "../SectionInfo/RelVarbInfo";
import { VarbPathNameInfoMixed } from "../SectionInfo/VarbPathNameInfo";

export type PathInVarbInfo =
  | RelInVarbInfo
  | PathNameVarbInfoMixed
  | VarbPathNameInfoMixed;

type RelInVarbInfo =
  | RelLocalVarbInfo
  | RelFirstChildVarbInfo
  | RelChildrenVarbInfo
  | RelStepSiblingVarbInfo
  | RelPiblingVarbInfo;

export type RelOutVarbInfo =
  | RelLocalVarbInfo
  | RelParentVarbInfo
  | RelStepSiblingOfChildVarbInfo
  | RelNiblingOfChildVarbInfo;
