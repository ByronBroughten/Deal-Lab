import { ValueName } from "../../../baseSectionsVarbs/baseVarb";
import { switchNames } from "../../../baseSectionsVarbs/RelSwitchVarb";
import { UpdateFnName } from "./UpdateFnName";
import { UpdateFnProps, updateFnPropS } from "./UpdateFnProps";

export type UpdateBasics<VN extends ValueName = ValueName> = {
  updateFnName: UpdateFnName<VN>;
  updateFnProps: UpdateFnProps;
};

export const updateBasicsS = {
  loadFromLocalValueEditor(): UpdateBasics<"numObj"> {
    return this.loadSolvableTextByVarbInfo("valueEditor", "valueSwitch");
  },
  loadSolvableTextByVarbInfo(
    varbInfoName: string,
    switchName: string
  ): UpdateBasics<"numObj"> {
    return {
      updateFnName: "loadSolvableTextByVarbInfo",
      updateFnProps: {
        varbInfo: updateFnPropS.local(varbInfoName),
        switch: updateFnPropS.local(switchName),
      },
    };
  },
  yearlyToMonthly<Base extends string>(
    baseVarbName: Base
  ): UpdateBasics<"numObj"> {
    const varbNames = switchNames(baseVarbName, "ongoing");
    return {
      updateFnName: "yearlyToMonthly",
      updateFnProps: {
        num: updateFnPropS.local(varbNames.yearly),
        switch: updateFnPropS.local(varbNames.switch),
      },
    };
  },
  monthlyToYearly<Base extends string>(
    baseVarbName: Base
  ): UpdateBasics<"numObj"> {
    const varbNames = switchNames(baseVarbName, "ongoing");
    return {
      updateFnName: "monthlyToYearly",
      updateFnProps: {
        num: updateFnPropS.local(varbNames.monthly),
      },
    };
  },
};
