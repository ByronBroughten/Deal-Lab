import { Merge } from "../../../../../utils/Obj/merge";
import { BaseValueName } from "../../baseSections/baseValues";
import { BaseVarbInfo } from "../../baseVarbInfo";
import { UpdateName, UpdateProps } from "../relValuesTypes";

type CoreUpdateInfo<
  T extends BaseValueName,
  U extends UpdateName<T, "wide">
> = {
  updateName: U;
  updateProps: UpdateProps<T, U>;
};

export type SwitchUpdateInfo = {
  switchInfo: BaseVarbInfo<"relLocal">;
  switchValue: string;
};
export type FullSwitchUpdateInfo<
  T extends BaseValueName,
  U extends UpdateName<T, "wide">
> = Merge<SwitchUpdateInfo, CoreUpdateInfo<T, U>>;
const testFullSwitchUpdateInfo = (
  info: FullSwitchUpdateInfo<"numObj", "sumNums">
) => {
  const _: "sumNums" = info.updateName;
  const __: UpdateProps<"numObj", "sumNums"> = info.updateProps;
};

export type UpdateInfoArr<T extends BaseValueName> = readonly [
  ...FullSwitchUpdateInfo<T, UpdateName<T, "wide">>[],
  CoreUpdateInfo<T, UpdateName<T, "wide">>
];
