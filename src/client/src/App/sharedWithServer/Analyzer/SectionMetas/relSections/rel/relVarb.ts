import {
  CommonPreVarb,
  DisplayName,
  NumObjPreVarb,
  PreVarbByType,
  StringPreVarb,
  UpdateFnProps,
  UpdateSwitches,
} from "./relVarbTypes";
import { BaseName } from "../baseSectionTypes";
import { InRelVarbInfo } from "./relVarbInfoTypes";
import { valueMeta } from "../baseSections/baseValues";
import { relVarbInfo } from "./relVarbInfo";
import {
  CalculationName,
  LeftRightPropCalculations,
  SinglePropCalculations,
} from "../baseSections/baseValues/NumObj/calculations";
import { relProps } from "./relMisc";

export type PreNumObjOptions = Partial<NumObjPreVarb & { initNumber: number }>;
export type LeftRightVarbInfos = [InRelVarbInfo, InRelVarbInfo];
export const relVarb = {
  common(commonProps: Partial<CommonPreVarb> = {}): CommonPreVarb {
    return {
      displayName: "",
      updateFnProps: {},
      inUpdateSwitchProps: [],
      ...commonProps,
    };
  },
  type<T extends keyof PreVarbByType>(
    type: T,
    partial: Partial<PreVarbByType[T]> = {}
  ): PreVarbByType[T] {
    const valueSchema = valueMeta[type];
    return {
      type,
      updateFnName: valueSchema.updateFnNames[0],
      initValue: valueSchema.defaultInit(),
      ...this.common(partial),
      ...(type === "numObj" && { unit: "money" }),
      ...partial,
    } as PreVarbByType[T];
  },
  string(partial: Partial<StringPreVarb> = {}) {
    return this.type("string", partial);
  },
  stringOrLoaded(
    sectionName: BaseName<"hasVarb">,
    partial: Partial<StringPreVarb> = {}
  ): StringPreVarb {
    return {
      ...this.string({
        inUpdateSwitchProps: [
          {
            switchInfo: {
              sectionName,
              varbName: "valueSwitch",
              id: "local",
              idType: "relative",
            },
            switchValue: "loadedVarb",
            updateFnName: "loadedString",
            updateFnProps: relProps.loadedVarb(sectionName),
          },
        ],
      }),
      ...partial,
    };
  },
  numObj(
    displayName: DisplayName,
    { initNumber, ...partial }: Partial<PreNumObjOptions> = {}
  ): NumObjPreVarb {
    return this.type("numObj", {
      displayName,
      ...partial,
    });
  },
  calcVarb(
    displayName: DisplayName,
    options?: PreNumObjOptions
  ): NumObjPreVarb {
    return this.numObj(displayName, {
      ...options,
      updateFnName: "calcVarbs",
    });
  },
  calcVarbBlank(options?: PreNumObjOptions): NumObjPreVarb {
    return this.calcVarb("", options);
  },
  moneyObj(displayName: DisplayName, partial: Partial<PreNumObjOptions> = {}) {
    return this.numObj(displayName, {
      ...partial,
      unit: "money",
      startAdornment: "$",
    });
  },
  moneyMonth(
    displayName: DisplayName,
    partial: Partial<PreNumObjOptions> = {}
  ) {
    return this.moneyObj(displayName, {
      ...partial,
      endAdornment: "/month",
    });
  },
  moneyYear(displayName: DisplayName, partial: Partial<PreNumObjOptions> = {}) {
    return this.moneyObj(displayName, {
      ...partial,
      endAdornment: "/year",
    });
  },
  percentObj(
    displayName: DisplayName,
    partial: Partial<PreNumObjOptions> = {}
  ): PreVarbByType["numObj"] {
    return this.numObj(displayName, {
      ...partial,
      unit: "percent",
      endAdornment: "%",
    });
  },
  sumNums(
    displayName: DisplayName,
    nums: InRelVarbInfo[],
    options?: PreNumObjOptions
  ): NumObjPreVarb {
    return this.type("numObj", {
      displayName,
      updateFnName: "sumNums",
      updateFnProps: { nums },
      ...options,
    });
  },
  sumMoney(
    displayName: DisplayName,
    nums: InRelVarbInfo[],
    options?: PreNumObjOptions
  ): NumObjPreVarb {
    return this.sumNums(displayName, nums, {
      ...options,
      unit: "money",
      startAdornment: "$",
    });
  },
  sumChildVarb(
    displayName: DisplayName,
    sectionName: BaseName<"hasVarb">,
    varbName: string
  ) {
    return this.sumNums(displayName, [
      { sectionName, varbName, id: "children", idType: "relative" },
    ]);
  },
  sumLocalMoney(
    displayName: DisplayName,
    localVarbNames: string[],
    sectionName: BaseName<"hasVarb">
  ) {
    const varbsToSum = relVarbInfo.localsByVarbName(
      sectionName,
      localVarbNames
    );
    return this.sumNums(displayName, varbsToSum, {
      unit: "money",
      startAdornment: "$",
    });
  },
  percentToPortion(
    displayName: DisplayName,
    updateFnProps: { base: InRelVarbInfo; percentOfBase: InRelVarbInfo },
    options?: PreNumObjOptions
  ): NumObjPreVarb {
    return this.calcVarb(displayName, {
      updateFnName: "percentToPortion",
      updateFnProps,
      ...options,
    });
  },
  singlePropFn(
    displayName: DisplayName,
    updateFnName: SinglePropCalculations,
    num: InRelVarbInfo,
    options?: PreNumObjOptions
  ): NumObjPreVarb {
    return this.type("numObj", {
      displayName,
      updateFnName,
      updateFnProps: { num },
      ...options,
    });
  },
  switch(
    displayName: DisplayName,
    updateFnName: CalculationName,
    updateFnProps: UpdateFnProps,
    inUpdateSwitchProps: UpdateSwitches,
    options?: PreNumObjOptions
  ): NumObjPreVarb {
    return this.type("numObj", {
      displayName,
      updateFnName,
      updateFnProps,
      inUpdateSwitchProps,
      ...options,
    });
  },
  leftRightPropFn(
    displayName: DisplayName,
    updateFnName: LeftRightPropCalculations,
    leftRight: LeftRightVarbInfos,
    options?: PreNumObjOptions
  ): NumObjPreVarb {
    return this.type("numObj", {
      displayName,
      updateFnName,
      updateFnProps: { leftSide: leftRight[0], rightSide: leftRight[1] },
      ...options,
    });
  },
};
