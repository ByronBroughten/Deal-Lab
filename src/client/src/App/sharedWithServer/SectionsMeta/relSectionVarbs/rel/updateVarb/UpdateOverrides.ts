import {
  switchKeyToVarbNames,
  SwitchTargetKey,
} from "../../../baseSectionsVarbs/baseSwitchNames";
import { ValueName } from "../../../baseSectionsVarbs/ValueName";
import {
  RelLocalVarbInfo,
  relVarbInfoS,
} from "../../../SectionInfo/RelVarbInfo";
import { updateBasics, UpdateBasics, updateBasicsS } from "./UpdateBasics";
import { UpdateFnName } from "./UpdateFnName";
import { updateFnProp, updateFnPropsS } from "./UpdateFnProps";

export type UpdateOverrides<VN extends ValueName = ValueName> =
  readonly UpdateOverride<VN>[];

export interface UpdateOverride<VN extends ValueName = ValueName>
  extends UpdateBasics<VN> {
  switches: UpdateOverrideSwitches;
}

export type UpdateOverrideSwitches = readonly UpdateOverrideSwitch[];

export interface UpdateOverrideSwitch {
  switchInfo: RelLocalVarbInfo;
  switchValue: OverrideSwitchValue;
}
type OverrideSwitchValue = string | boolean;

export const overrideSwitchS = {
  ongoing<K extends SwitchTargetKey<"ongoing">>(
    baseVarbName: string,
    switchKey: K
  ) {
    const varbNames = switchKeyToVarbNames(baseVarbName, "ongoing");
    return this.local(varbNames.switch, switchKey);
  },
  monthlyIsActive(baseVarbName: string) {
    return this.ongoing(baseVarbName, "monthly");
  },
  yearlyIsActive(baseVarbName: string) {
    return this.ongoing(baseVarbName, "yearly");
  },
  local(varbName: string, switchValue: OverrideSwitchValue) {
    return {
      switchInfo: relVarbInfoS.local(varbName),
      switchValue,
    } as const;
  },
  localIsTrue(varbName: string) {
    return this.local(varbName, true);
  },
  localIsFalse(varbName: string) {
    return this.local(varbName, false);
  },
  valueSourceIs(valueSource: string) {
    return overrideSwitchS.local("valueSourceSwitch", valueSource);
  },
};

export function updateOverride<
  VN extends ValueName,
  US extends UpdateOverrideSwitches
>(switches: US, updateBasics: UpdateBasics<VN>): UpdateOverride<VN> {
  const { updateFnProps, ...rest } = updateBasics;
  for (const updateSwitch of switches) {
    const { switchInfo } = updateSwitch;
    updateFnProps[switchInfo.varbName] = updateFnProp(switchInfo);
  }
  return {
    switches,
    updateFnProps,
    ...rest,
  };
}

export const updateOverrideS = {
  loadedVarbProp(updateFnName: UpdateFnName<"stringObj">) {
    return updateOverride(
      [overrideSwitchS.local("valueSourceSwitch", "loadedVarb")],
      updateBasics(
        updateFnName,
        updateFnPropsS.localByVarbName(["valueEntityInfo"])
      )
    ) as UpdateOverride<"stringObj">;
  },
  yearlyIfActive<Base extends string>(
    baseVarbName: Base
  ): UpdateOverride<"numObj"> {
    return updateOverride(
      [overrideSwitchS.yearlyIsActive(baseVarbName)],
      updateBasicsS.yearlyToMonthly(baseVarbName)
    );
  },
  monthlyIfActive<Base extends string>(
    baseVarbName: Base
  ): UpdateOverride<"numObj"> {
    return {
      switches: [overrideSwitchS.monthlyIsActive(baseVarbName)],
      ...updateBasicsS.monthlyToYearly(baseVarbName),
    } as const;
  },
};
