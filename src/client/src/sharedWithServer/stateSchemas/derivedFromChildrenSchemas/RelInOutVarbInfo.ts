import { PathNameVarbInfoMixed } from "../../StateGetters/Identifiers/PathNameInfo";
import {
  RelChildrenVarbInfo,
  RelFirstChildVarbInfo,
  RelLocalVarbInfo,
  RelNiblingOfChildVarbInfo,
  RelParentVarbInfo,
  RelPiblingVarbInfo,
  RelStepSiblingOfChildVarbInfo,
  RelStepSiblingVarbInfo,
} from "../../StateGetters/Identifiers/RelVarbInfo";
import { VarbPathNameInfoMixed } from "../../StateGetters/Identifiers/VarbPathNameInfo";

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
