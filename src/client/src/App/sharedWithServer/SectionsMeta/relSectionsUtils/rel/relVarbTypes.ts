import {
  RelInVarbInfo,
  RelSingleInVarbInfo,
} from "../../childSectionsDerived/RelInOutVarbInfo";
import { RelLocalVarbInfo } from "../../childSectionsDerived/RelVarbInfo";
import {
  UpdateFnName,
  ValueSchemas,
  ValueTypeName,
  ValueTypes,
} from "./valueMetaTypes";

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
  updateFnProps: UpdateFnProps;
  inUpdateSwitchProps: UpdateSwitches;
  displayName: DisplayName;
  startAdornment: string;
  endAdornment: string;
};
type UniqueTypeProps = {
  numObj: {
    unit: keyof ValueSchemas["numObj"]["units"];
  };
};
type ValueSpecificProps = {
  [Prop in ValueTypeName]: {
    updateFnName: ValueSchemas[Prop]["updateFnNames"][number];
    initValue: ValueTypes[Prop];
  };
} & UniqueTypeProps;
export type RelVarbByType = {
  [Prop in ValueTypeName]: CommonRelVarb &
    ValueSpecificProps[Prop] & { type: Prop };
};
export type RelVarb<T extends ValueTypeName = ValueTypeName> = RelVarbByType[T];

export type NumObjRelVarb = RelVarbByType["numObj"];
export type StringRelVarb = RelVarbByType["string"];
