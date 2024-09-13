import { isString } from "lodash";
import { isVarbName } from "../../../StateGetters/Identifiers/VarbInfoBase";
import { VarbPathName } from "../../../StateGetters/Identifiers/VarbPathNameInfo";
import { GroupVarbNameBase } from "../../fromSchema3SectionStructures/baseGroupNames";
import {
  safeGroupVarbName,
  validateAnyVarbName,
  VarbNameWide,
} from "../../fromSchema3SectionStructures/baseSectionsVarbsTypes";
import { ChildName } from "../../fromSchema6SectionChildren/ChildName";
import { ValueName } from "../../schema1ValueNames";
import { switchKeyToVarbNames } from "../../schema3SectionStructures/baseSwitchNames";
import {
  LeftRightPropCalcName,
  NumPropCalcName,
} from "../../schema4ValueTraits/StateValue/stateValuesShared/calculations";
import { UpdateFnName } from "./UpdateFnName";
import {
  CompletionStatusProps,
  UpdateFnProp,
  UpdateFnProps,
  upS,
} from "./UpdateFnProps";

export type UpdateBasics<VN extends ValueName = ValueName> = {
  updateFnName: UpdateFnName<VN>;
  updateFnProps: UpdateFnProps;
};

export type UpdateBasicsNext<
  UN extends UpdateFnName<VN>,
  VN extends ValueName = ValueName
> = {
  updateFnName: UN;
  updateFnProps: UpdateFnProps;
};

export function updateBasicsNext<UN extends UpdateFnName>(
  updateFnName: UN,
  updateFnProps?: UpdateFnProps
): UpdateBasicsNext<UN> {
  return {
    updateFnName,
    updateFnProps: updateFnProps ?? {},
  };
}

export function updateBasics<VN extends ValueName>(
  updateFnName: UpdateFnName<VN>,
  updateFnProps?: UpdateFnProps
): UpdateBasics<VN> {
  return {
    updateFnName,
    updateFnProps: updateFnProps ?? {},
  };
}

export type StandardUP = UpdateFnProp | VarbNameWide;
export function standardToProp(standard: StandardUP): UpdateFnProp {
  return isVarbName(standard) ? upS.local(standard) : standard;
}

export const updateBasicsS = {
  fnName<UN extends UpdateFnName>(
    updateFnName: UN,
    updateFnProps?: UpdateFnProps
  ): UpdateBasicsNext<UN> {
    return updateBasicsNext(updateFnName, updateFnProps);
  },
  get emptyNumObj() {
    return this.fnName("emptyNumObj");
  },
  get calcVarbs() {
    return updateBasicsNext("calcVarbs");
  },
  get notApplicable() {
    return updateBasicsNext("notApplicable");
  },
  get zero() {
    return updateBasicsNext("solvableTextZero");
  },
  get one() {
    return updateBasicsNext("solvableTextOne");
  },
  get pointOne() {
    return updateBasicsNext("solvableTextPointOne");
  },
  get pointZeroFive() {
    return updateBasicsNext("solvableTextPointZeroFive");
  },
  get pointEightFive() {
    return updateBasicsNext("solvableTextPointEightFive");
  },
  get pointOneFive() {
    return updateBasicsNext("solvableTextPointOneFive");
  },
  get throw() {
    return updateBasicsNext("throwIfReached");
  },
  sumVarbPathName(...names: VarbPathName[]): UpdateBasics<"numObj"> {
    return updateBasicsNext("sumNums", {
      nums: names.map((name) => upS.varbPathName(name)),
    });
  },
  sumNums(...inits: StandardUP[]): UpdateBasics<"numObj"> {
    const nums = inits.map((init) => (isString(init) ? upS.local(init) : init));
    return updateBasicsNext("sumNums", { nums });
  },
  sumChildren(childName: ChildName, varbName: string): UpdateBasics<"numObj"> {
    return this.sumNums(upS.children(childName, varbName));
  },
  varbPathLeftRight(
    updateFnName: LeftRightPropCalcName,
    leftSide: VarbPathName,
    rightSide: VarbPathName
  ): UpdateBasics<"numObj"> {
    return this.equationLR(
      updateFnName,
      upS.varbPathName(leftSide),
      upS.varbPathName(rightSide)
    );
  },
  multiply(left: StandardUP, right: StandardUP): UpdateBasics<"numObj"> {
    return this.equationLR("multiply", left, right);
  },
  divide(left: StandardUP, right: StandardUP): UpdateBasics<"numObj"> {
    return this.equationLR("divide", left, right);
  },
  subtract(left: StandardUP, right: StandardUP): UpdateBasics<"numObj"> {
    return this.equationLR("subtract", left, right);
  },
  equationLR(
    updateFnName: LeftRightPropCalcName,
    left: StandardUP,
    right: StandardUP
  ): UpdateBasics<"numObj"> {
    const leftSide = standardToProp(left);
    const rightSide = standardToProp(right);
    return updateBasicsNext(updateFnName, { leftSide, rightSide });
  },
  equationSimple(
    updateFnName: NumPropCalcName,
    num: StandardUP
  ): UpdateBasics<"numObj"> {
    num = isVarbName(num) ? upS.local(num) : num;
    return updateBasicsNext(updateFnName, { num });
  },
  percentToDecimal(num: StandardUP): UpdateBasics<"numObj"> {
    return this.equationSimple("percentToDecimal", num);
  },
  decimalToPercent(num: StandardUP): UpdateBasics<"numObj"> {
    return this.equationSimple("decimalToPercent", num);
  },
  manualUpdateOnly() {
    return updateBasicsNext("manualUpdateOnly");
  },
  localStringToStringObj(varbName: VarbNameWide): UpdateBasics<"stringObj"> {
    return updateBasics("localStringToStringObj", {
      localString: upS.local(varbName),
    });
  },
  loadLocal(varbName: VarbNameWide) {
    return updateBasicsNext("loadSolvableTextByVarbInfo", {
      varbInfo: upS.local(varbName),
    });
  },
  loadChild(childName: ChildName, varbName: VarbNameWide) {
    return updateBasicsNext("loadSolvableTextByVarbInfo", {
      varbInfo: upS.onlyChild(childName, varbName),
    });
  },
  loadFromFirstChild(childName: ChildName, varbName: VarbNameWide) {
    return updateBasicsNext("loadSolvableTextByVarbInfo", {
      varbInfo: upS.firstChild(childName, varbName),
    });
  },
  varbPathName(varbPathName: VarbPathName) {
    return updateBasicsNext("loadSolvableTextByVarbInfo", {
      varbInfo: upS.varbPathName(varbPathName),
    });
  },
  loadLocalValueEditor(): UpdateBasics<"numObj"> {
    return this.loadLocal("valueEditor");
  },
  monthsToYears<Base extends string>(base: Base) {
    const varbNames = switchKeyToVarbNames(base, "monthsYears");
    return updateBasicsNext("monthsToYears", {
      num: upS.local(validateAnyVarbName(varbNames.months)),
    });
  },
  yearsToMonths<Base extends string>(base: Base) {
    const varbNames = switchKeyToVarbNames(base, "monthsYears");
    return updateBasicsNext("yearsToMonths", {
      num: upS.local(validateAnyVarbName(varbNames.years)),
    });
  },
  yearsToMonths2(base: string): UpdateBasics<"numObj"> {
    const yearsVarbName = safeGroupVarbName(base, "timespan", "years");
    return {
      updateFnName: "yearsToMonths",
      updateFnProps: { num: upS.local(yearsVarbName) },
    };
  },
  monthsToYears2(base: string): UpdateBasics<"numObj"> {
    const monthsVarbName = safeGroupVarbName(base, "timespan", "months");
    return {
      updateFnName: "monthsToYears",
      updateFnProps: { num: upS.local(monthsVarbName) },
    };
  },

  yearlyToMonthly2(
    base: GroupVarbNameBase<"periodic">
  ): UpdateBasics<"numObj"> {
    const yearlyVarbName = safeGroupVarbName(base, "periodic", "yearly");
    return {
      updateFnName: "yearlyToMonthly",
      updateFnProps: { num: upS.local(yearlyVarbName) },
    };
  },
  monthlyToYearly2(
    base: GroupVarbNameBase<"periodic">
  ): UpdateBasics<"numObj"> {
    const monthlyVarb = safeGroupVarbName(base, "periodic", "monthly");
    return {
      updateFnName: "monthlyToYearly",
      updateFnProps: { num: upS.local(monthlyVarb) },
    };
  },
  yearlyToMonthly<Base extends string>(
    baseVarbName: Base
  ): UpdateBasics<"numObj"> {
    const varbNames = switchKeyToVarbNames(baseVarbName, "periodic");
    return updateBasicsNext("yearlyToMonthly", {
      num: upS.local(validateAnyVarbName(varbNames.yearly)),
      switch: upS.local(validateAnyVarbName(varbNames.switch)),
    });
  },
  monthlyToYearly<Base extends string>(
    baseVarbName: Base
  ): UpdateBasics<"numObj"> {
    const varbNames = switchKeyToVarbNames(baseVarbName, "periodic");
    return updateBasicsNext("monthlyToYearly", {
      num: upS.local(validateAnyVarbName(varbNames.monthly)),
    });
  },
  completionStatus(
    props: Partial<CompletionStatusProps>
  ): UpdateBasicsNext<"completionStatus"> {
    return {
      updateFnName: "completionStatus",
      updateFnProps: upS.completionStatus(props),
    };
  },
};

export const ubS = updateBasicsS;
