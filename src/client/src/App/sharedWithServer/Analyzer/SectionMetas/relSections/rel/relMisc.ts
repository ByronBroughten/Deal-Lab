import { switchVarbNames } from "../baseSections/baseSwitch";
import { relVarbInfo } from "./relVarbInfo";
import { RelUpdateInfo } from "./relVarb/UpdateInfoArr";
import {
  InRelVarbInfo,
  LocalRelVarbInfo,
  SingleInRelVarbInfo,
} from "./relVarbInfoTypes";
import { baseValues } from "../baseSections/baseValues";
import { BaseName } from "../baseNameArrs";
import { NumObj } from "../baseSections/baseValues/NumObj";
import { Relative } from "../baseInfo";
import { VarbName } from "../baseVarbInfo";

export const relAdorn = {
  moneyMonth: { startAdornment: "$", endAdornment: "/month" },
  moneyYear: { startAdornment: "$", endAdornment: "/year" },
};
export const relProps = {
  named<SN extends BaseName<"hasVarb">, VN extends VarbName<SN>>(
    relative: Relative<"inVarb">,
    names: [kwargName: string, sectionName: SN, varbName: VN][]
  ): UpdateFnProps {
    return names.reduce((props, [kwargName, sectionName, varbName]) => {
      return {
        ...props,
        [kwargName]: relVarbInfo.relative(sectionName, varbName, relative),
      };
    }, {} as UpdateFnProps);
  },
  locals<T extends string>(
    sectionName: BaseName<"hasVarb">,
    varbNames: T[]
  ): { [Prop in T]: LocalRelVarbInfo } {
    return varbNames.reduce((localProps, varbName) => {
      localProps[varbName] = relVarbInfo.local(sectionName, varbName);
      return localProps;
    }, {} as { [varbName: string]: LocalRelVarbInfo }) as {
      [Prop in T]: LocalRelVarbInfo;
    };
  },
  loadedVarb(sectionName: BaseName<"hasVarb">) {
    return this.locals(sectionName, [
      "sectionName",
      "varbName",
      "id",
      "idType",
    ]);
  },
  num(num: InRelVarbInfo) {
    return { num };
  },
  leftRight(
    leftSide: InRelVarbInfo,
    rightSide: InRelVarbInfo
  ): { leftSide: InRelVarbInfo; rightSide: InRelVarbInfo } {
    return { leftSide, rightSide };
  },
};

export const relUpdateSwitch = {
  base(
    switchInfo: LocalRelVarbInfo,
    switchValue: string,
    updateFnName: UpdateFnName,
    updateFnProps: UpdateFnProps = {}
  ): RelUpdateInfo {
    return {
      switchInfo,
      switchValue,
      updateFnName,
      updateFnProps,
    };
  },
  yearlyToMonthly<Base extends string>(
    sectionName: BaseName<"hasVarb">,
    baseVarbName: Base
  ): RelUpdateInfo {
    const varbNames = switchVarbNames(baseVarbName, "ongoing");
    return {
      switchInfo: relVarbInfo.local(sectionName, varbNames.switch),
      switchValue: "yearly",
      updateFnName: "yearlyToMonthly",
      updateFnProps: {
        num: relVarbInfo.local(sectionName, varbNames.yearly),
        switch: relVarbInfo.local(sectionName, varbNames.switch),
      },
    };
  },
  monthlyToYearly<Base extends string>(
    sectionName: BaseName<"hasVarb">,
    baseVarbName: Base
  ): RelUpdateInfo {
    const varbNames = switchVarbNames(baseVarbName, "ongoing");
    return {
      switchInfo: relVarbInfo.local(sectionName, varbNames.switch),
      switchValue: "monthly",
      updateFnName: "monthlyToYearly",
      updateFnProps: {
        num: relVarbInfo.local(sectionName, varbNames.monthly),
      },
    };
  },
  divideToPercent(
    sectionName: BaseName<"hasVarb">,
    switchName: string,
    switchValue: string,
    leftSide: SingleInRelVarbInfo,
    rightSide: SingleInRelVarbInfo
  ): RelUpdateInfo {
    return {
      switchInfo: relVarbInfo.local(sectionName, switchName),
      switchValue,
      updateFnName: "divideToPercent",
      updateFnProps: relProps.leftRight(leftSide, rightSide),
    };
  },
  percentToDecimalTimesBase<Base extends string>(
    sectionName: BaseName<"hasVarb">,
    baseVarbName: Base,
    rightSide: SingleInRelVarbInfo
  ): RelUpdateInfo {
    const varbNames = switchVarbNames(baseVarbName, "dollarsPercent");
    return {
      switchInfo: relVarbInfo.local(sectionName, varbNames.switch),
      switchValue: "percent",
      updateFnName: "percentToDecimalTimesBase",
      updateFnProps: {
        leftSide: relVarbInfo.local(sectionName, varbNames.percent),
        rightSide,
      },
    };
  },
};

export const relValue = {
  numObj(value?: number | string): NumObj {
    const strValue = `${value ?? ""}`;
    return baseValues["numObj"].defaultInit({ editorText: strValue });
  },
};
