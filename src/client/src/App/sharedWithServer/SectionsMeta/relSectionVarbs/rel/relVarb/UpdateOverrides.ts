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

export const updateOverrideS = {
  yearlyToMonthly<Base extends string>(
    baseVarbName: Base
  ): UpdateOverride<"numObj"> {
    const varbNames = switchNames(baseVarbName, "ongoing");
    return {
      switchInfo: relVarbInfoS.local(varbNames.switch),
      switchValue: "yearly",
      ...updateBasicsS.yearlyToMonthly(baseVarbName),
    } as const;
  },
  monthlyToYearly<Base extends string>(
    baseVarbName: Base
  ): UpdateOverride<"numObj"> {
    const varbNames = switchNames(baseVarbName, "ongoing");
    return {
      switchInfo: relVarbInfoS.local(varbNames.switch),
      switchValue: "monthly",
      ...updateBasicsS.monthlyToYearly(baseVarbName),
    } as const;
  },
};
