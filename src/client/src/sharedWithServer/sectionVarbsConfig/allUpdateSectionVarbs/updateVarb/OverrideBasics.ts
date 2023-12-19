import { StrictExtract } from "../../../utils/types";
import { DealMode } from "../../StateValue/dealMode";
import { ValueSource, ValueSourceType } from "../../StateValue/unionValues";
import { UpdateBasics } from "./UpdateBasics";
import { UpdateFnName } from "./UpdateFnName";
import { StandardSP } from "./UpdateOverrideSwitch";
import { UpdateOverrides, ValueSourceOptions, uosS } from "./UpdateOverrides";

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
  dealMode(
    updateBasics: Record<DealMode, UpdateBasics>,
    options?: ValueSourceOptions
  ): OverrideBasics {
    return uosb(uosS.dealMode(updateBasics, options));
  },
  valueSource<VT extends ValueSourceType>(
    _valueSourceType: VT,
    updateBasics: Record<ValueSource<VT>, UpdateBasics>,
    options?: ValueSourceOptions
  ): OverrideBasics {
    return uosb(uosS.valueSource(_valueSourceType, updateBasics, options));
  },
  boolean(
    finder: StandardSP,
    basics: {
      true: UpdateBasics;
      false: UpdateBasics;
    }
  ): OverrideBasics {
    return uosb(uosS.boolean(finder, basics));
  },
} as const;
