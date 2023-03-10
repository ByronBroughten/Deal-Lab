import {
  getSwitchVarbName,
  SwitchName,
  SwitchTargetKey,
} from "../../allBaseSectionVarbs/baseSwitchNames";
import { ChildName } from "../../sectionChildrenDerived/ChildName";
import { mixedInfoS } from "../../SectionInfo/MixedSectionInfo";
import { PathNameVarbInfoMixed } from "../../SectionInfo/PathNameInfo";
import {
  RelChildrenVarbInfo,
  RelLocalVarbInfo,
  relVarbInfoS,
} from "../../SectionInfo/RelVarbInfo";
import {
  VarbPathName,
  VarbPathNameInfoMixed,
  VarbPathValue,
} from "../../SectionInfo/VarbPathNameInfo";
import {
  SectionPathName,
  SectionPathVarbName,
} from "../../sectionPathContexts/sectionPathNames";
import { ValueSource } from "../../values/StateValue/unionValues";
import { ValueName } from "../../values/ValueName";
import { updateBasics, UpdateBasics, updateBasicsS } from "./UpdateBasics";
import { UpdateFnName } from "./UpdateFnName";
import {
  collectUpdateFnSwitchProps,
  UpdateFnProp,
  updateFnProp,
  updateFnPropsS,
} from "./UpdateFnProps";

export type UpdateOverrides<VN extends ValueName = ValueName> =
  readonly UpdateOverride<VN>[];

export interface UpdateOverride<VN extends ValueName = ValueName>
  extends UpdateBasics<VN> {
  switches: UpdateOverrideSwitches;
}

export type UpdateOverrideSwitches = readonly UpdateOverrideSwitch[];

type UpdateOverrideSwitchInfo =
  | RelChildrenVarbInfo
  | RelLocalVarbInfo
  | VarbPathNameInfoMixed
  | PathNameVarbInfoMixed;
export interface UpdateOverrideSwitch {
  switchInfo: UpdateOverrideSwitchInfo;
  switchValues: OverrideSwitchValue[];
}

export function overrideSwitch(
  switchInfo: RelLocalVarbInfo | VarbPathNameInfoMixed | PathNameVarbInfoMixed,
  ...switchValues: OverrideSwitchValue[]
): UpdateOverrideSwitch {
  return {
    switchInfo,
    switchValues,
  };
}

type OverrideSwitchValue = string | boolean;

export function collectOverrideSwitchProps(
  updateOverrides: UpdateOverrides
): UpdateOverrides {
  let nextOverrides: UpdateOverrides = [];
  for (const { switches, updateFnProps, ...rest } of updateOverrides) {
    const andOverrideSwitches: UpdateFnProp[] = [];
    for (const updateSwitch of switches) {
      const { switchInfo } = updateSwitch;
      andOverrideSwitches.push(updateFnProp(switchInfo));
    }
    nextOverrides = nextOverrides.concat({
      switches,
      updateFnProps: collectUpdateFnSwitchProps({
        ...updateFnProps,
        andOverrideSwitches,
      }),
      ...rest,
    });
  }
  return nextOverrides;
}

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
  child(
    childName: ChildName,
    varbName: string,
    ...switchValues: OverrideSwitchValue[]
  ): UpdateOverrideSwitch {
    return {
      switchInfo: relVarbInfoS.children(childName, varbName),
      switchValues,
    };
  },
  ongoing<K extends SwitchTargetKey<"ongoing">>(
    baseName: string,
    switchKey: K
  ): UpdateOverrideSwitch {
    const varbName = getSwitchVarbName(baseName, "ongoing", "switch");
    return this.local(varbName, switchKey);
  },
  monthsIsActive(baseName: string) {
    return this.switchIsActive(baseName, "monthsYears", "months");
  },
  yearsIsActive(baseName: string) {
    return this.switchIsActive(baseName, "monthsYears", "years");
  },
  monthlyIsActive(baseVarbName: string): UpdateOverrideSwitch {
    return this.ongoing(baseVarbName, "monthly");
  },
  yearlyIsActive(baseVarbName: string): UpdateOverrideSwitch {
    return this.ongoing(baseVarbName, "yearly");
  },
  pathHasValue<PN extends SectionPathName, VN extends SectionPathVarbName<PN>>(
    pathName: PN,
    varbName: VN,
    ...switchValues: OverrideSwitchValue[]
  ): UpdateOverrideSwitch {
    return {
      switchInfo: mixedInfoS.pathNameVarb(pathName, varbName),
      switchValues,
    };
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
  valueSourceIs(valueSource: ValueSource): UpdateOverrideSwitch {
    return overrideSwitchS.local("valueSourceName", valueSource);
  },
};

export function updateOverride<
  VN extends ValueName,
  US extends UpdateOverrideSwitches
>(switches: US, updateBasics: UpdateBasics<VN>): UpdateOverride<VN> {
  return {
    switches,
    ...updateBasics,
  };
}

type Test = UpdateFnName<"stringObj">;
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
