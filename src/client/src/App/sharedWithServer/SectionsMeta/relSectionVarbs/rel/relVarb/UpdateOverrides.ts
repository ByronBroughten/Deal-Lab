import { ValueName } from "../../../baseSectionsVarbs/baseVarb";
import { switchNames } from "../../../baseSectionsVarbs/RelSwitchVarb";
import {
  RelLocalVarbInfo,
  relVarbInfoS,
} from "../../../SectionInfo/RelVarbInfo";
import { UpdateBasics, updateBasicsS } from "./UpdateBasicts";

export interface UpdateOverrideProps {
  switchInfo: RelLocalVarbInfo;
  switchValue: string;
}
export interface UpdateOverride<VN extends ValueName = ValueName>
  extends UpdateOverrideProps,
    UpdateBasics<VN> {}

export type UpdateOverrides<VN extends ValueName = ValueName> =
  UpdateOverride<VN>[];

export const updateOverrideS = {
  yearlyToMonthly<Base extends string>(baseVarbName: Base): UpdateOverride {
    const varbNames = switchNames(baseVarbName, "ongoing");
    return {
      switchInfo: relVarbInfoS.local(varbNames.switch),
      switchValue: "yearly",
      ...updateBasicsS.yearlyToMonthly(baseVarbName),
    };
  },
  monthlyToYearly<Base extends string>(baseVarbName: Base): UpdateOverride {
    const varbNames = switchNames(baseVarbName, "ongoing");
    return {
      switchInfo: relVarbInfoS.local(varbNames.switch),
      switchValue: "monthly",
      ...updateBasicsS.monthlyToYearly(baseVarbName),
    };
  },
};
