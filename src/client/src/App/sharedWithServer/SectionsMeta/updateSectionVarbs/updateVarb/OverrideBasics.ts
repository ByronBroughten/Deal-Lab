import { StrictExtract } from "../../../utils/types";
import {
  ValueSource,
  ValueSourceType,
} from "../../values/StateValue/unionValues";
import { UpdateBasics } from "./UpdateBasics";
import { UpdateFnName } from "./UpdateFnName";
import { uosS, UpdateOverrides, ValueSourceOptions } from "./UpdateOverrides";

type ThrowIfReached = StrictExtract<UpdateFnName, "throwIfReached">;
export type OverrideBasics = {
  updateFnName: ThrowIfReached;
  updateOverrides: UpdateOverrides;
};

export function uosb(updateOverrides: UpdateOverrides): OverrideBasics {
  return {
    updateFnName: "throwIfReached",
    updateOverrides,
  };
}

export const uosbS = {
  valueSource<VT extends ValueSourceType>(
    _valueSourceType: VT,
    updateBasics: Record<ValueSource<VT>, UpdateBasics>,
    options?: ValueSourceOptions
  ) {
    return uosb(uosS.valueSource(_valueSourceType, updateBasics, options));
  },
} as const;
