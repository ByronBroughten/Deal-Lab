import { switchKeyToVarbNames } from "../../allBaseSectionVarbs/baseSwitchNames";
import {
  LeftRightPropCalcName,
  NumPropCalcName,
} from "../../allBaseSectionVarbs/baseValues/calculations";
import { ValueName } from "../../allBaseSectionVarbs/ValueName";
import { ChildName } from "../../sectionChildrenDerived/ChildName";
import { VarbPathName } from "../../SectionInfo/VarbPathNameInfo";
import { UpdateFnName } from "./UpdateFnName";
import { UpdateFnProp, UpdateFnProps, updateFnPropS } from "./UpdateFnProps";

export type UpdateBasics<VN extends ValueName = ValueName> = {
  updateFnName: UpdateFnName<VN>;
  updateFnProps: UpdateFnProps;
};

export function updateBasics<VN extends ValueName>(
  updateFnName: UpdateFnName<VN>,
  updateFnProps?: UpdateFnProps
): UpdateBasics<VN> {
  return {
    updateFnName,
    updateFnProps: updateFnProps ?? {},
  };
}

export const updateBasicsS = {
  get zero() {
    return {
      updateFnName: "solvableTextZero",
      updateFnProps: {},
    };
  },
  get throw() {
    return {
      updateFnName: "throwIfReached",
      updateFnProps: {},
    };
  },
  sumVarbPathName(...names: VarbPathName[]): UpdateBasics<"numObj"> {
    return updateBasics("sumNums", {
      nums: names.map((name) => updateFnPropS.varbPathName(name)),
    });
  },
  sumNums(...nums: UpdateFnProp[]): UpdateBasics<"numObj"> {
    return updateBasics("sumNums", { nums });
  },
  sumChildren(childName: ChildName, varbName: string): UpdateBasics<"numObj"> {
    return this.sumNums(updateFnPropS.children(childName, varbName));
  },
  varbPathLeftRight(
    updateFnName: LeftRightPropCalcName,
    leftSide: VarbPathName,
    rightSide: VarbPathName
  ): UpdateBasics<"numObj"> {
    return this.equationLeftRight(
      updateFnName,
      updateFnPropS.varbPathName(leftSide),
      updateFnPropS.varbPathName(rightSide)
    );
  },
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
  loadByVarbPathName(varbPathName: VarbPathName) {
    return updateBasics("loadSolvableTextByVarbInfo", {
      varbInfo: updateFnPropS.varbPathName(varbPathName),
    });
  },
  loadFromLocalValueEditor(): UpdateBasics<"numObj"> {
    return this.loadSolvableTextByVarbInfo("valueEditor");
  },
  loadSolvableTextByVarbInfo(varbInfoName: string): UpdateBasics<"numObj"> {
    return updateBasics("loadSolvableTextByVarbInfo", {
      varbInfo: updateFnPropS.local(varbInfoName),
    });
  },
  monthsToYears<Base extends string>(base: Base) {
    const varbNames = switchKeyToVarbNames(base, "monthsYears");
    return {
      updateFnName: "monthsToYears",
      updateFnProps: { num: updateFnPropS.local(varbNames.months) },
    };
  },
  yearsToMonths<Base extends string>(base: Base) {
    const varbNames = switchKeyToVarbNames(base, "monthsYears");
    return {
      updateFnName: "yearsToMonths",
      updateFnProps: { num: updateFnPropS.local(varbNames.years) },
    };
  },
  yearlyToMonthly<Base extends string>(
    baseVarbName: Base
  ): UpdateBasics<"numObj"> {
    const varbNames = switchKeyToVarbNames(baseVarbName, "ongoing");
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
    const varbNames = switchKeyToVarbNames(baseVarbName, "ongoing");
    return {
      updateFnName: "monthlyToYearly",
      updateFnProps: {
        num: updateFnPropS.local(varbNames.monthly),
      },
    };
  },
};
