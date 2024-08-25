import { ValueName } from "../../ValueName";
import { updateBasics, UpdateBasics, updateBasicsS } from "./UpdateBasics";
import {
  overrideSwitchS,
  UpdateOverrideSwitches,
} from "./UpdateOverrideSwitch";

export interface UpdateOverride<VN extends ValueName = ValueName>
  extends UpdateBasics<VN> {
  switches: UpdateOverrideSwitches;
}

export function updateOverride<
  VN extends ValueName,
  US extends UpdateOverrideSwitches
>(switches: US, updateBasics: UpdateBasics<VN>): UpdateOverride<VN> {
  return {
    switches,
    ...updateBasics,
  };
}
export const uO = updateOverride;

export const updateOverrideS = {
  get emptyNumObjIfSourceIsNone() {
    return updateOverride(
      [overrideSwitchS.local("valueSourceName", "none")],
      updateBasics("emptyNumObj")
    );
  },
  get zeroIfSourceIsZero() {
    return updateOverride(
      [overrideSwitchS.valueSourceIs("zero")],
      updateBasicsS.zero
    );
  },
};
