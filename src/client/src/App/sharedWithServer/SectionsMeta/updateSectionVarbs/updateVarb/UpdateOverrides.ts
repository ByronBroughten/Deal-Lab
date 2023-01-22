import {
  getSwitchVarbName,
  SwitchName,
  SwitchTargetKey,
} from "../../allBaseSectionVarbs/baseSwitchNames";
import { ValueName } from "../../allBaseSectionVarbs/ValueName";
import { mixedInfoS } from "../../sectionChildrenDerived/MixedSectionInfo";
import { RelLocalVarbInfo, relVarbInfoS } from "../../SectionInfo/RelVarbInfo";
import {
  VarbPathName,
  VarbPathNameInfoMixed,
  VarbPathValue,
} from "../../SectionInfo/VarbPathNameInfo";
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
  switchInfo: RelLocalVarbInfo | VarbPathNameInfoMixed;
  switchValues: OverrideSwitchValue[];
}
type OverrideSwitchValue = string | boolean;

export const overrideSwitchS = {
  switchIsActive<SN extends SwitchName, SK extends SwitchTargetKey<SN>>(
    baseName: string,
    switchName: SN,
    ...switchValues: SK[]
  ): UpdateOverrideSwitch {
    const varbName = getSwitchVarbName(baseName, switchName, "switch");
    return this.local(varbName, ...(switchValues as string[]));
  },
  local(
    varbName: string,
    ...switchValues: OverrideSwitchValue[]
  ): UpdateOverrideSwitch {
    return {
      switchInfo: relVarbInfoS.local(varbName),
      switchValues,
    } as const;
  },
  ongoing<K extends SwitchTargetKey<"ongoing">>(
    baseName: string,
    switchKey: K
  ): UpdateOverrideSwitch {
    const varbName = getSwitchVarbName(baseName, "ongoing", "switch");
    return this.local(varbName, switchKey);
  },
  monthlyIsActive(baseVarbName: string): UpdateOverrideSwitch {
    return this.ongoing(baseVarbName, "monthly");
  },
  yearlyIsActive(baseVarbName: string): UpdateOverrideSwitch {
    return this.ongoing(baseVarbName, "yearly");
  },
  varbIsValue<VPN extends VarbPathName>(
    varbPathName: VPN,
    ...switchValues: Extract<VarbPathValue<VPN>, OverrideSwitchValue>[]
  ): UpdateOverrideSwitch {
    return {
      switchInfo: mixedInfoS.varbPathName(varbPathName),
      switchValues,
    };
  },
  localIsTrue(varbName: string): UpdateOverrideSwitch {
    return this.local(varbName, true);
  },
  localIsFalse(varbName: string): UpdateOverrideSwitch {
    return this.local(varbName, false);
  },
  valueSourceIs(valueSource: string): UpdateOverrideSwitch {
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
    if (switchInfo.infoType === "local") {
      updateFnProps[switchInfo.varbName] = updateFnProp(switchInfo);
    } else if (switchInfo.infoType === "varbPathName") {
      updateFnProps[switchInfo.varbPathName] = updateFnProp(switchInfo);
    }
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
