import {
  RelFindByFocalVarbInfo,
  InRelVarbInfo,
  LocalRelVarbInfo,
} from "./relVarbInfoTypes";
import { NumObj } from "./relValue/numObj";
import {
  UpdateFnName,
  ValueSchemas,
  ValueTypeName,
  ValueTypes,
} from "./relValueTypes";

export type UpdateFnProps = {
  [kwargName: string]: InRelVarbInfo | InRelVarbInfo[];
};
export type SwitchUpdateInfo = {
  switchInfo: LocalRelVarbInfo;
  switchValue: string;
};
export type UpdateSwitchProp = SwitchUpdateInfo & {
  updateFnName: UpdateFnName;
  updateFnProps: UpdateFnProps;
};
export type UpdateSwitches = UpdateSwitchProp[];
export type DisplayName = string | RelFindByFocalVarbInfo;
export type CommonPreVarb = {
  updateFnProps: UpdateFnProps;
  inUpdateSwitchProps: UpdateSwitches;
  displayName: DisplayName;
  startAdornment?: string;
  endAdornment?: string;
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
export type PreVarbByType = {
  [Prop in ValueTypeName]: CommonPreVarb &
    ValueSpecificProps[Prop] & { type: Prop };
};
export type PreVarb<T extends ValueTypeName = ValueTypeName> = PreVarbByType[T];
export type NumObjPreVarb = PreVarbByType["numObj"];
export type StringPreVarb = PreVarbByType["string"];
export function isNumObjPreVarb(relVarb: PreVarb): relVarb is NumObjPreVarb {
  return relVarb.initValue instanceof NumObj;
}
