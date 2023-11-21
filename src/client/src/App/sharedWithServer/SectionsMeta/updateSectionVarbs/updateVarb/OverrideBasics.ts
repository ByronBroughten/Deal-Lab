import { StrictExtract } from "../../../utils/types";
import { UpdateFnName } from "./UpdateFnName";
import { UpdateOverrides } from "./UpdateOverrides";

type ThrowIfReached = StrictExtract<UpdateFnName, "throwIfReached">;
export type OverrideBasics = {
  updateFnName: ThrowIfReached;
  updateOverrides: UpdateOverrides;
};

export function uosB(updateOverrides: UpdateOverrides): OverrideBasics {
  return {
    updateFnName: "throwIfReached",
    updateOverrides,
  };
}
