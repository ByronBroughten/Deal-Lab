import { switchNames } from "../../baseSectionsVarbs/RelSwitchVarb";
import { relVarbInfoS } from "../../SectionInfo/RelVarbInfo";
import { UpdateSwitchProp } from "./relVarbTypes";
import { updateFnPropS } from "./UpdateFnProps";

export const relUpdateSwitch = {
  yearlyToMonthly<Base extends string>(baseVarbName: Base): UpdateSwitchProp {
    const varbNames = switchNames(baseVarbName, "ongoing");
    return {
      switchInfo: relVarbInfoS.local(varbNames.switch),
      switchValue: "yearly",
      updateFnName: "yearlyToMonthly",
      updateFnProps: {
        num: updateFnPropS.local(varbNames.yearly),
        switch: updateFnPropS.local(varbNames.switch),
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
        num: updateFnPropS.local(varbNames.monthly),
      },
    };
  },
};
