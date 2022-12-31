import { SwitchTargetKey } from "../../../baseSectionsVarbs/baseSwitchNames";
import { ValueName } from "../../../baseSectionsVarbs/baseVarb";
import { switchNames } from "../../../baseSectionsVarbs/RelSwitchVarb";
import {
  RelLocalVarbInfo,
  relVarbInfoS,
} from "../../../SectionInfo/RelVarbInfo";
import { UpdateBasics, updateBasicsS } from "./UpdateBasics";

export interface UpdateOverrideSwitch {
  switchInfo: RelLocalVarbInfo;
  switchValue: string;
}
export interface UpdateOverride<VN extends ValueName = ValueName>
  extends UpdateOverrideSwitch,
    UpdateBasics<VN> {}

export type UpdateOverrides<VN extends ValueName = ValueName> =
  readonly UpdateOverride<VN>[];

export const overrideSwitchS = {
  ongoing<K extends SwitchTargetKey<"ongoing">>(
    baseVarbName: string,
    switchKey: K
  ) {
    const varbNames = switchNames(baseVarbName, "ongoing");
    return {
      switchInfo: relVarbInfoS.local(varbNames.switch),
      switchValue: switchKey,
    } as const;
  },
  monthlyIsActive(baseVarbName: string) {
    return this.ongoing(baseVarbName, "monthly");
  },
  yearlyIsActive(baseVarbName: string) {
    return this.ongoing(baseVarbName, "yearly");
  },
};

export const updateOverrideS = {
  yearlyToMonthly<Base extends string>(
    baseVarbName: Base
  ): UpdateOverride<"numObj"> {
    return {
      ...overrideSwitchS.yearlyIsActive(baseVarbName),
      ...updateBasicsS.yearlyToMonthly(baseVarbName),
    } as const;
  },
  monthlyToYearly<Base extends string>(
    baseVarbName: Base
  ): UpdateOverride<"numObj"> {
    return {
      ...overrideSwitchS.monthlyIsActive(baseVarbName),
      ...updateBasicsS.monthlyToYearly(baseVarbName),
    } as const;
  },
};
