import { PathNameVarbInfoMixed } from "../../SectionInfos/PathNameInfo";
import {
  RelChildrenVarbInfo,
  RelFirstChildVarbInfo,
  RelLocalVarbInfo,
  RelNiblingOfChildVarbInfo,
  RelParentVarbInfo,
  RelPiblingVarbInfo,
  RelStepSiblingOfChildVarbInfo,
  RelStepSiblingVarbInfo,
} from "../../SectionInfos/RelVarbInfo";
import { VarbPathNameInfoMixed } from "../../SectionInfos/VarbPathNameInfo";

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
