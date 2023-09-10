import { switchKeyToVarbNames } from "../../allBaseSectionVarbs/baseSwitchNames";
import {
  validateAnyVarbName,
  VarbNameWide,
} from "../../baseSectionsDerived/baseSectionsVarbsTypes";
import { ChildName } from "../../sectionChildrenDerived/ChildName";
import { VarbPathName } from "../../SectionInfo/VarbPathNameInfo";
import {
  LeftRightPropCalcName,
  NumPropCalcName,
} from "../../values/StateValue/valuesShared/calculations";
import { ValueName } from "../../values/ValueName";
import { UpdateFnName } from "./UpdateFnName";
import { UpdateFnProp, UpdateFnProps, updateFnPropS } from "./UpdateFnProps";

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

export const updateBasicsS = {
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
      nums: names.map((name) => updateFnPropS.varbPathName(name)),
    });
  },
  sumNums(...nums: UpdateFnProp[]): UpdateBasics<"numObj"> {
    return updateBasicsNext("sumNums", { nums });
  },
  sumChildren(childName: ChildName, varbName: string): UpdateBasics<"numObj"> {
    return this.sumNums(updateFnPropS.children(childName, varbName));
  },
  varbPathLeftRight(
    updateFnName: LeftRightPropCalcName,
    leftSide: VarbPathName,
    rightSide: VarbPathName
  ): UpdateBasics<"numObj"> {
    return this.equationLR(
      updateFnName,
      updateFnPropS.varbPathName(leftSide),
      updateFnPropS.varbPathName(rightSide)
    );
  },
  equationLR(
    updateFnName: LeftRightPropCalcName,
    leftSide: UpdateFnProp,
    rightSide: UpdateFnProp
  ): UpdateBasics<"numObj"> {
    return updateBasicsNext(updateFnName, { leftSide, rightSide });
  },
  equationSimple(
    updateFnName: NumPropCalcName,
    num: UpdateFnProp
  ): UpdateBasics<"numObj"> {
    return updateBasicsNext(updateFnName, { num });
  },
  manualUpdateOnly() {
    return updateBasicsNext("manualUpdateOnly");
  },
  localStringToStringObj(varbName: VarbNameWide): UpdateBasics<"stringObj"> {
    return updateBasics("localStringToStringObj", {
      localString: updateFnPropS.local(varbName),
    });
  },
  loadFromLocal(varbName: VarbNameWide) {
    return updateBasicsNext("loadSolvableTextByVarbInfo", {
      varbInfo: updateFnPropS.local(varbName),
    });
  },
  loadFromChild(childName: ChildName, varbName: VarbNameWide) {
    return updateBasicsNext("loadSolvableTextByVarbInfo", {
      varbInfo: updateFnPropS.onlyChild(childName, varbName),
    });
  },
  loadFromFirstChild(childName: ChildName, varbName: VarbNameWide) {
    return updateBasicsNext("loadSolvableTextByVarbInfo", {
      varbInfo: updateFnPropS.firstChild(childName, varbName),
    });
  },
  loadByVarbPathName(varbPathName: VarbPathName) {
    return updateBasicsNext("loadSolvableTextByVarbInfo", {
      varbInfo: updateFnPropS.varbPathName(varbPathName),
    });
  },
  loadFromLocalValueEditor(): UpdateBasics<"numObj"> {
    return this.loadSolvableTextByVarbInfo("valueEditor");
  },
  loadSolvableTextByVarbInfo(
    varbInfoName: VarbNameWide
  ): UpdateBasics<"numObj"> {
    return updateBasicsNext("loadSolvableTextByVarbInfo", {
      varbInfo: updateFnPropS.local(varbInfoName),
    });
  },
  monthsToYears<Base extends string>(base: Base) {
    const varbNames = switchKeyToVarbNames(base, "monthsYears");
    return updateBasicsNext("monthsToYears", {
      num: updateFnPropS.local(validateAnyVarbName(varbNames.months)),
    });
  },
  yearsToMonths<Base extends string>(base: Base) {
    const varbNames = switchKeyToVarbNames(base, "monthsYears");
    return updateBasicsNext("yearsToMonths", {
      num: updateFnPropS.local(validateAnyVarbName(varbNames.years)),
    });
  },
  yearlyToMonthly<Base extends string>(
    baseVarbName: Base
  ): UpdateBasics<"numObj"> {
    const varbNames = switchKeyToVarbNames(baseVarbName, "periodic");
    return updateBasicsNext("yearlyToMonthly", {
      num: updateFnPropS.local(validateAnyVarbName(varbNames.yearly)),
      switch: updateFnPropS.local(validateAnyVarbName(varbNames.switch)),
    });
  },
  monthlyToYearly<Base extends string>(
    baseVarbName: Base
  ): UpdateBasics<"numObj"> {
    const varbNames = switchKeyToVarbNames(baseVarbName, "periodic");
    return updateBasicsNext("monthlyToYearly", {
      num: updateFnPropS.local(validateAnyVarbName(varbNames.monthly)),
    });
  },
};
