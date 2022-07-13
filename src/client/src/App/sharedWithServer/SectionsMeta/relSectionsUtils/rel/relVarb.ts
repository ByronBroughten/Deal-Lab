import { SimpleSectionName } from "../../baseSections";
import {
  LeftRightPropCalculations,
  SinglePropCalculations,
} from "../../baseSectionsUtils/baseValues/calculations";
import { ChildName } from "../../childSectionsDerived/ChildName";
import { RelInVarbInfo } from "../../childSectionsDerived/RelInOutVarbInfo";
import { relVarbInfoS } from "../../childSectionsDerived/RelVarbInfo";
import { relVarbInfosS } from "../../childSectionsDerived/RelVarbInfos";
import { valueMeta } from "../valueMeta";
import {
  CommonRelVarb,
  DisplayName,
  NumObjRelVarb,
  RelVarbByType,
  StringRelVarb,
} from "./relVarbTypes";

const makeDefaultCommon = <T extends CommonRelVarb>(common: T): CommonRelVarb =>
  common;
const defaultCommon = makeDefaultCommon({
  displayName: "",
  displayNameEnd: "",

  updateFnProps: {},
  inUpdateSwitchProps: [],

  startAdornment: "",
  endAdornment: "",
});

export function relVarb<T extends keyof RelVarbByType>(
  type: T,
  partial: Partial<RelVarbByType[T]> = {}
): RelVarbByType[T] {
  const valueSchema = valueMeta[type];
  return {
    type,
    updateFnName: valueSchema.updateFnNames[0],
    initValue: valueSchema.initDefault(),
    ...defaultCommon,
    ...partial,
    ...(type === "numObj" && { unit: "money" }),
  } as RelVarbByType[T];
}

export type RelNumObjOptions = Partial<NumObjRelVarb & { initNumber: number }>;
export type LeftRightVarbInfos = [RelInVarbInfo, RelInVarbInfo];
export const relVarbS = {
  stringOrLoaded(partial: Partial<StringRelVarb> = {}): StringRelVarb {
    return {
      ...relVarb("string", {
        inUpdateSwitchProps: [
          {
            switchInfo: relVarbInfoS.local("valueSwitch"),
            switchValue: "loadedVarb",
            updateFnName: "loadedString",
            updateFnProps: relVarbInfosS.localEntityInfo(),
          },
        ],
      }),
      ...partial,
    };
  },
  numObj(
    displayName: DisplayName,
    { initNumber, ...partial }: Partial<RelNumObjOptions> = {}
  ): NumObjRelVarb {
    return relVarb("numObj", {
      displayName,
      ...partial,
    });
  },
  calcVarb(
    displayName: DisplayName,
    options?: RelNumObjOptions
  ): NumObjRelVarb {
    return baseVarbs("numObj", displayName, {
      ...options,
      updateFnName: "calcVarbs",
    });
  },
  calcVarbBlank(options?: RelNumObjOptions): NumObjRelVarb {
    return this.calcVarb("", options);
  },
  moneyObj(displayName: DisplayName, partial: Partial<RelNumObjOptions> = {}) {
    return baseVarbs("numObj", displayName, {
      ...partial,
      unit: "money",
      startAdornment: "$",
    });
  },
  moneyMonth(
    displayName: DisplayName,
    partial: Partial<RelNumObjOptions> = {}
  ) {
    return this.moneyObj(displayName, {
      ...partial,
      endAdornment: "/month",
    });
  },
  moneyYear(displayName: DisplayName, partial: Partial<RelNumObjOptions> = {}) {
    return this.moneyObj(displayName, {
      ...partial,
      endAdornment: "/year",
    });
  },
  percentObj(
    displayName: DisplayName,
    partial: Partial<RelNumObjOptions> = {}
  ): RelVarbByType["numObj"] {
    return baseVarbs("numObj", displayName, {
      ...partial,
      unit: "percent",
      endAdornment: "%",
    });
  },
  sumNums(
    displayName: DisplayName,
    nums: RelInVarbInfo[],
    options?: RelNumObjOptions
  ): NumObjRelVarb {
    return relVarb("numObj", {
      displayName,
      updateFnName: "sumNums",
      updateFnProps: { nums },
      ...options,
    });
  },
  sumMoney(
    displayName: DisplayName,
    nums: RelInVarbInfo[],
    options?: RelNumObjOptions
  ): NumObjRelVarb {
    return this.sumNums(displayName, nums, {
      ...options,
      unit: "money",
      startAdornment: "$",
    });
  },
  sumChildVarb<SN extends SimpleSectionName>(
    displayName: DisplayName,
    childName: ChildName<SN>,
    varbName: string
  ) {
    return this.sumNums(displayName, [
      relVarbInfoS.children(childName, varbName),
    ]);
  },
  percentToPortion(
    displayName: DisplayName,
    updateFnProps: { base: RelInVarbInfo; percentOfBase: RelInVarbInfo },
    options?: RelNumObjOptions
  ): NumObjRelVarb {
    return this.calcVarb(displayName, {
      updateFnName: "percentToPortion",
      updateFnProps,
      ...options,
    });
  },
  singlePropFn(
    displayName: DisplayName,
    updateFnName: SinglePropCalculations,
    num: RelInVarbInfo,
    options?: RelNumObjOptions
  ): NumObjRelVarb {
    return relVarb("numObj", {
      displayName,
      updateFnName,
      updateFnProps: { num },
      ...options,
    });
  },
  leftRightPropFn(
    displayName: DisplayName,
    updateFnName: LeftRightPropCalculations,
    leftRight: LeftRightVarbInfos,
    options?: RelNumObjOptions
  ): NumObjRelVarb {
    return relVarb("numObj", {
      displayName,
      updateFnName,
      updateFnProps: { leftSide: leftRight[0], rightSide: leftRight[1] },
      ...options,
    });
  },
};
