import {
  UpdateFnName,
  ValueNamesToTypes,
  ValueSchemas,
} from "../../baseSectionsDerived/valueMetaTypes";
import { NumObjUnit } from "../../baseSectionsUtils/baseValues/NumObj";
import { ValueName } from "../../baseSectionsUtils/baseVarb";
import {
  RelInVarbInfo,
  RelSingleInVarbInfo,
} from "../../childSectionsDerived/RelInOutVarbInfo";
import { RelLocalVarbInfo } from "../../childSectionsDerived/RelVarbInfo";

export type UpdateFnProps = {
  [kwargName: string]: RelInVarbInfo | RelInVarbInfo[];
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
export type DisplayName = string | RelSingleInVarbInfo;
export type CommonRelVarb = {
  virtualVarb: {
    value: string;
    displayName: string;
    displayNameEnd: string;
  } | null;

  updateFnProps: UpdateFnProps;
  inUpdateSwitchProps: UpdateSwitches;

  displayName: DisplayName;
  displayNameEnd: string;

  startAdornment: string;
  endAdornment: string;
};
type UniqueTypeProps = {
  numObj: {
    unit: NumObjUnit;
  };
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
