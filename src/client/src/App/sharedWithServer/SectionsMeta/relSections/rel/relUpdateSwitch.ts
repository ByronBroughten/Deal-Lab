import { switchNames } from "../../baseSectionsVarbs/RelSwitchVarb";
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
};
