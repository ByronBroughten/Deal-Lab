import {
  LeftRightPropCalcName,
  NumPropCalcName,
} from "../../../baseSectionsVarbs/baseValues/calculations";
import { ValueName } from "../../../baseSectionsVarbs/baseVarb";
import { switchNames } from "../../../baseSectionsVarbs/RelSwitchVarb";
import { ChildName } from "../../../sectionChildrenDerived/ChildName";
import { UpdateFnName } from "./UpdateFnName";
import { UpdateFnProp, UpdateFnProps, updateFnPropS } from "./UpdateFnProps";

export type UpdateBasics<VN extends ValueName = ValueName> = {
  updateFnName: UpdateFnName<VN>;
  updateFnProps: UpdateFnProps;
};

export function updateBasics<VN extends ValueName>(
  updateFnName: UpdateFnName<VN>,
  updateFnProps: UpdateFnProps
): UpdateBasics<VN> {
  return {
    updateFnName,
    updateFnProps,
  };
}

export const updateBasicsS = {
  equationLeftRight(
    updateFnName: LeftRightPropCalcName,
    leftSide: UpdateFnProp,
    rightSide: UpdateFnProp
  ): UpdateBasics<"numObj"> {
    return updateBasics(updateFnName, { leftSide, rightSide });
  },
  equationSimple(
    updateFnName: NumPropCalcName,
    num: UpdateFnProp
  ): UpdateBasics<"numObj"> {
    return updateBasics(updateFnName, { num });
  },
  manualUpdateOnly() {
    return {
      updateFnName: "manualUpdateOnly",
      updateFnProps: {},
    } as const;
  },
  loadFromLocal(varbName: string) {
    return updateBasics("loadSolvableTextByVarbInfo", {
      varbInfo: updateFnPropS.local(varbName),
    });
  },
  loadFromChild(childName: ChildName, varbName: string) {
    return updateBasics("loadSolvableTextByVarbInfo", {
      varbInfo: updateFnPropS.onlyChild(childName, varbName),
    });
  },
  loadFromLocalValueEditor(): UpdateBasics<"numObj"> {
    return this.loadSolvableTextByVarbInfo("valueEditor", "valueSourceSwitch");
  },
  loadSolvableTextByVarbInfo(
    varbInfoName: string,
    switchName: string
  ): UpdateBasics<"numObj"> {
    return updateBasics("loadSolvableTextByVarbInfo", {
      varbInfo: updateFnPropS.local(varbInfoName),
      switch: updateFnPropS.local(switchName),
    });
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
