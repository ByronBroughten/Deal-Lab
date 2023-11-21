import { ValueName } from "../../values/ValueName";
import { updateBasics, UpdateBasics, updateBasicsS } from "./UpdateBasics";
import { UpdateFnName } from "./UpdateFnName";
import { updateFnPropsS } from "./UpdateFnProps";
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
  loadedVarbProp(updateFnName: UpdateFnName<"stringObj">) {
    return updateOverride(
      [overrideSwitchS.local("valueSourceName", "loadedVarb")],
      updateBasics(
        updateFnName,
        updateFnPropsS.localByVarbName(["valueEntityInfo"])
      )
    ) as UpdateOverride<"stringObj">;
  },
  activeYearlyToMonthly<Base extends string>(
    baseVarbName: Base
  ): UpdateOverride<"numObj"> {
    return updateOverride(
      [overrideSwitchS.yearlyIsActive(baseVarbName)],
      updateBasicsS.yearlyToMonthly(baseVarbName)
    );
  },
  activeMonthlyToYearly<Base extends string>(
    baseVarbName: Base
  ): UpdateOverride<"numObj"> {
    return {
      switches: [overrideSwitchS.monthlyIsActive(baseVarbName)],
      ...updateBasicsS.monthlyToYearly(baseVarbName),
    } as const;
  },
};
