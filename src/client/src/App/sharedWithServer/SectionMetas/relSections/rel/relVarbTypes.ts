import { NumObj } from "../../baseSections/baseValues/NumObj";
import {
  InRelVarbInfo,
  LocalRelVarbInfo,
  RelFindByFocalVarbInfo,
} from "./relVarbInfoTypes";
import {
  DbValueTypes,
  UpdateFnName,
  ValueSchemas,
  ValueTypeName,
  ValueTypes,
} from "./valueMetaTypes";

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
    dbInitValue: DbValueTypes[Prop];
  };
} & UniqueTypeProps;
export type RelVarbByType = {
  [Prop in ValueTypeName]: CommonRelVarb &
    ValueSpecificProps[Prop] & { type: Prop };
};
export type RelVarb<T extends ValueTypeName = ValueTypeName> = RelVarbByType[T];
export type NumObjRelVarb = RelVarbByType["numObj"];
export type StringPreVarb = RelVarbByType["string"];
export function isNumObjRelVarb(relVarb: RelVarb): relVarb is NumObjRelVarb {
  return relVarb.initValue instanceof NumObj;
}