import { switchNames } from "../../baseSectionsUtils/RelSwitchVarb";
import { RelInVarbInfo } from "../../childSectionsDerived/RelInOutVarbInfo";
import { relVarbInfoS } from "../../childSectionsDerived/RelVarbInfo";
import { UpdateSwitchProp } from "./relVarbTypes";

export const relUpdateSwitch = {
  yearlyToMonthly<Base extends string>(baseVarbName: Base): UpdateSwitchProp {
    const varbNames = switchNames(baseVarbName, "ongoing");
    return {
      switchInfo: relVarbInfoS.local(varbNames.switch),
      switchValue: "yearly",
      updateFnName: "yearlyToMonthly",
      updateFnProps: {
        num: relVarbInfoS.local(varbNames.yearly),
        switch: relVarbInfoS.local(varbNames.switch),
      },
    };
  },
  monthlyToYearly<Base extends string>(baseVarbName: Base): UpdateSwitchProp {
    const varbNames = switchNames(baseVarbName, "ongoing");
    return {
      switchInfo: relVarbInfoS.local(varbNames.switch),
      switchValue: "monthly",
      updateFnName: "monthlyToYearly",
      updateFnProps: {
        num: relVarbInfoS.local(varbNames.monthly),
      },
    };
  },
  divideToPercent(
    switchName: string,
    switchValue: string,
    leftSide: RelInVarbInfo,
    rightSide: RelInVarbInfo
  ): UpdateSwitchProp {
    return {
      switchInfo: relVarbInfoS.local(switchName),
      switchValue,
      updateFnName: "divideToPercent",
      updateFnProps: { leftSide, rightSide },
    };
  },
  percentToDecimalTimesBase<Base extends string>(
    baseVarbName: Base,
    rightSide: RelInVarbInfo
  ): UpdateSwitchProp {
    const varbNames = switchNames(baseVarbName, "dollarsPercent");
    return {
      switchInfo: relVarbInfoS.local(varbNames.switch),
      switchValue: "percent",
      updateFnName: "percentToDecimalTimesBase",
      updateFnProps: {
        leftSide: relVarbInfoS.local(varbNames.percent),
        rightSide,
      },
    };
  },
};