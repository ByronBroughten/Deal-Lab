import { switchNames } from "../baseSections/switchNames";
import { preVarbInfo } from "./relVarbInfo";
import { UpdateFnProps, UpdateSwitchProp } from "./relVarbTypes";
import {
  InRelVarbInfo,
  InVarbRelative,
  LocalRelVarbInfo,
  SingleInRelVarbInfo,
} from "./relVarbInfoTypes";
import { relValue } from "./relValue";
import { BaseName } from "../baseSectionTypes";
import { UpdateFnName } from "./relValueTypes";
import { NumObj } from "./relValue/numObj";

export const preAdorn = {
  moneyMonth: { startAdornment: "$", endAdornment: "/month" },
  moneyYear: { startAdornment: "$", endAdornment: "/year" },
};
export const preProps = {
  named(
    relative: InVarbRelative,
    names: [
      kwargName: string,
      sectionName: BaseName<"hasVarb">,
      varbName: string
    ][]
  ): UpdateFnProps {
    return names.reduce((props, [kwargName, sectionName, varbName]) => {
      return {
        ...props,
        [kwargName]: preVarbInfo.relative(sectionName, varbName, relative),
      };
    }, {} as UpdateFnProps);
  },
  locals<T extends string>(
    sectionName: BaseName<"hasVarb">,
    varbNames: T[]
  ): { [Prop in T]: LocalRelVarbInfo } {
    return varbNames.reduce((localProps, varbName) => {
      localProps[varbName] = preVarbInfo.local(sectionName, varbName);
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

export const updateSwitchMold = {
  base(
    switchInfo: LocalRelVarbInfo,
    switchValue: string,
    updateFnName: UpdateFnName,
    updateFnProps: UpdateFnProps = {}
  ): UpdateSwitchProp {
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
  ): UpdateSwitchProp {
    const varbNames = switchNames(baseVarbName, "ongoing");
    return {
      switchInfo: preVarbInfo.local(sectionName, varbNames.switch),
      switchValue: "yearly",
      updateFnName: "yearlyToMonthly",
      updateFnProps: {
        num: preVarbInfo.local(sectionName, varbNames.yearly),
        switch: preVarbInfo.local(sectionName, varbNames.switch),
      },
    };
  },
  monthlyToYearly<Base extends string>(
    sectionName: BaseName<"hasVarb">,
    baseVarbName: Base
  ): UpdateSwitchProp {
    const varbNames = switchNames(baseVarbName, "ongoing");
    return {
      switchInfo: preVarbInfo.local(sectionName, varbNames.switch),
      switchValue: "monthly",
      updateFnName: "monthlyToYearly",
      updateFnProps: {
        num: preVarbInfo.local(sectionName, varbNames.monthly),
      },
    };
  },
  divideToPercent(
    sectionName: BaseName<"hasVarb">,
    switchName: string,
    switchValue: string,
    leftSide: SingleInRelVarbInfo,
    rightSide: SingleInRelVarbInfo
  ): UpdateSwitchProp {
    return {
      switchInfo: preVarbInfo.local(sectionName, switchName),
      switchValue,
      updateFnName: "divideToPercent",
      updateFnProps: preProps.leftRight(leftSide, rightSide),
    };
  },
  percentToDecimalTimesBase<Base extends string>(
    sectionName: BaseName<"hasVarb">,
    baseVarbName: Base,
    rightSide: SingleInRelVarbInfo
  ): UpdateSwitchProp {
    const varbNames = switchNames(baseVarbName, "dollarsPercent");
    return {
      switchInfo: preVarbInfo.local(sectionName, varbNames.switch),
      switchValue: "percent",
      updateFnName: "percentToDecimalTimesBase",
      updateFnProps: {
        leftSide: preVarbInfo.local(sectionName, varbNames.percent),
        rightSide,
      },
    };
  },
};

export const preValue = {
  numObj(value?: number | string): NumObj {
    if (value === undefined) value = "";
    const strValue = `${value}`;
    return relValue["numObj"].defaultInit({
      editorText: strValue,
      solvableText: strValue,
    });
  },
};
