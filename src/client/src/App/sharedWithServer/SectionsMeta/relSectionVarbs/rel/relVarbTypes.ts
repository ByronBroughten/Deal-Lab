import {
  UpdateFnName,
  ValueNamesToTypes,
  ValueSchemas,
} from "../../baseSectionsDerived/valueMetaTypes";
import { NumUnitName } from "../../baseSectionsVarbs/baseValues/calculations/numUnitParams";
import { ValueName } from "../../baseSectionsVarbs/baseVarb";
import { PathInVarbInfo } from "../../sectionChildrenDerived/RelInOutVarbInfo";
import { RelLocalInfo } from "../../SectionInfo/RelInfo";
import { RelLocalVarbInfo } from "../../SectionInfo/RelVarbInfo";

export type UpdateFnProps = {
  [kwargName: string]: PathInVarbInfo | PathInVarbInfo[];
};
export type SwitchUpdateInfo = {
  switchInfo: RelLocalVarbInfo;
  switchValue: string;
};
export type UpdateSwitchProp = SwitchUpdateInfo & {
  updateFnName: UpdateFnName;
  updateFnProps: UpdateFnProps;
};

export type UpdateSwitches = UpdateSwitchProp[];
export type DisplayName = string | RelLocalInfo;
export type CommonRelVarb = {
  virtualVarb: {
    value: string;
    displayName: string;
    displayNameEnd: string;
  } | null;

  updateFnProps: UpdateFnProps;
  inUpdateSwitchProps: UpdateSwitches;

  displayName: DisplayName;
  displayNameStart: string;
  displayNameEnd: string;

  startAdornment: string;
  endAdornment: string;
};
type UniqueTypeProps = {
  numObj: { unit: NumUnitName };
};
type ValueSpecificProps = {
  [Prop in ValueName]: {
    updateFnName: ValueSchemas[Prop]["updateFnNames"][number];
    initValue: ValueNamesToTypes[Prop];
  };
} & UniqueTypeProps;
export type RelVarbByType = {
  [Prop in ValueName]: CommonRelVarb &
    ValueSpecificProps[Prop] & { type: Prop };
};

export type RelVarb<T extends ValueName = ValueName> = RelVarbByType[T];

export type NumObjRelVarb = RelVarbByType["numObj"];
export type StringRelVarb = RelVarbByType["string"];
