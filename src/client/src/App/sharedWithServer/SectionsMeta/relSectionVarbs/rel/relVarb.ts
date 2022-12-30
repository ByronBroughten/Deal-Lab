import { valueMeta } from "../../baseSectionsDerived/valueMeta";
import {
  LeftRightPropCalculations,
  SinglePropCalculations,
} from "../../baseSectionsVarbs/baseValues/calculations";
import { numObj } from "../../baseSectionsVarbs/baseValues/NumObj";
import { ValueName } from "../../baseSectionsVarbs/baseVarb";
import { ChildName } from "../../sectionChildrenDerived/ChildName";
import { SectionName } from "../../SectionName";
import { getUpdateFnNames } from "./relVarb/UpdateFnName";
import { UpdateFnProp, updateFnPropS } from "./relVarb/UpdateFnProps";
import {
  CommonRelVarb,
  DisplayName,
  NumObjRelVarb,
  RelVarb,
} from "./relVarbTypes";

const makeDefaultCommon = <T extends CommonRelVarb>(common: T): CommonRelVarb =>
  common;
const defaultCommon = makeDefaultCommon({
  virtualVarb: null,

  displayName: "",
  displayNameEnd: "",
  displayNameStart: "",

  updateFnProps: {},
  updateOverrides: [],

  startAdornment: "",
  endAdornment: "",
});

export function relVarb<T extends ValueName>(
  type: T,
  partial: Partial<RelVarb<T>> = {}
): RelVarb<T> {
  const valueSchema = valueMeta[type];
  return {
    type,
    updateFnName: getUpdateFnNames(type)[0],
    initValue: valueSchema.initDefault(),
    ...defaultCommon,
    ...(type === "numObj" && { unit: "money" }),
    ...partial,
  } as RelVarb<T>;
}

export type RelNumObjOptions = Partial<NumObjRelVarb & { initNumber: number }>;
export type LeftRightVarbInfos = [UpdateFnProp, UpdateFnProp];
export const relVarbS = {
  numObj(
    displayName: DisplayName,
    { initNumber, ...partial }: Partial<RelNumObjOptions> = {}
  ): NumObjRelVarb {
    return relVarb("numObj", {
      ...(initNumber ? { initValue: numObj(initNumber) } : {}),
      displayName,
      ...partial,
    });
  },
  percentObj(
    displayName: DisplayName,
    partial: Partial<RelNumObjOptions> = {}
  ): RelVarb<"numObj"> {
    return this.numObj(displayName, {
      ...partial,
      unit: "percent",
      endAdornment: "%",
    });
  },
  get displayNameEditor() {
    return relVarb("string", { updateFnName: "manualUpdateOnly" });
  },
  calcVarb(
    displayName: DisplayName,
    options?: RelNumObjOptions
  ): NumObjRelVarb {
    return this.numObj(displayName, {
      ...options,
      updateFnName: "calcVarbs",
    });
  },
  calcVarbBlank(options?: RelNumObjOptions): NumObjRelVarb {
    return this.calcVarb("", options);
  },
  moneyObj(displayName: DisplayName, partial: Partial<RelNumObjOptions> = {}) {
    return this.numObj(displayName, {
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
  sumNums(
    displayName: DisplayName,
    nums: UpdateFnProp[],
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
    nums: UpdateFnProp[],
    options?: RelNumObjOptions
  ): NumObjRelVarb {
    return this.sumNums(displayName, nums, {
      ...options,
      unit: "money",
      startAdornment: "$",
    });
  },
  sumChildVarb<SN extends SectionName>(
    displayName: DisplayName,
    childName: ChildName<SN>,
    varbName: string
  ) {
    return this.sumNums(displayName, [
      updateFnPropS.children(childName, varbName),
    ]);
  },
  singlePropFn(
    displayName: DisplayName,
    updateFnName: SinglePropCalculations,
    num: UpdateFnProp,
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
