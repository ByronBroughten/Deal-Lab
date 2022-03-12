import { Merge } from "../../../../../utils/Obj/merge";
import { BaseValueName } from "../../baseSections/baseValues";
import { BaseVarbInfo } from "../../baseVarbInfo";
import { UpdateName, UpdateProps } from "../relValuesTypes";

type CoreStuff<T extends BaseValueName, U extends UpdateName<T, "wide">> = {
  updateName: U;
  updateProps: UpdateProps<T, U>;
};

export type RelUpdateSwitchStuff = {
  switchInfo: BaseVarbInfo<"relLocal">;
  switchValue: string;
};
export type RelUpdateInfo<
  T extends BaseValueName,
  U extends UpdateName<T, "wide">,
  C extends "core" | "full" = "full"
> = C extends "full"
  ? Merge<CoreStuff<T, U>, RelUpdateSwitchStuff>
  : CoreStuff<T, U>;
const _FullSwitchUpdateInfoTest = (
  info: RelUpdateInfo<"numObj", "sumNums">
) => {
  const _: "sumNums" = info.updateName;
  const __: UpdateProps<"numObj", "sumNums"> = info.updateProps;
};

export type UpdateInfoArr<T extends BaseValueName> = readonly [
  ...RelUpdateInfo<T, UpdateName<T, "wide">>[],
  CoreStuff<T, UpdateName<T, "wide">>
];
