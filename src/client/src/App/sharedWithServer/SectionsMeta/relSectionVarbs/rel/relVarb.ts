import { DisplayName } from "../../allDisplaySectionVarbs";
import { valueMetas } from "../../baseSectionsDerived/valueMetas";
import {
  LeftRightPropCalcName,
  NumPropCalcName,
} from "../../baseSectionsVarbs/baseValues/calculations";
import { numObj } from "../../baseSectionsVarbs/baseValues/NumObj";
import { ValueName } from "../../baseSectionsVarbs/baseVarbDepreciated";
import { ChildName } from "../../sectionChildrenDerived/ChildName";
import { SectionName } from "../../SectionName";
import { getUpdateFnNames } from "./relVarb/UpdateFnName";
import { UpdateFnProp, updateFnPropS } from "./relVarb/UpdateFnProps";
import { UpdateProps, updatePropsS } from "./relVarb/UpdateProps";
import { CommonRelVarb, NumObjRelVarb, RelVarb } from "./relVarbTypes";

const makeDefaultCommon = <T extends CommonRelVarb>(common: T): CommonRelVarb =>
  common;
const defaultCommon = makeDefaultCommon({
  displayName: "",
  displayNameEnd: "",
  displayNameStart: "",
  startAdornment: "",
  endAdornment: "",
});

function makeDefaultUpdateProps<VN extends ValueName>(
  valueName: VN
): UpdateProps<VN> {
  return {
    updateFnName: getUpdateFnNames(valueName)[0],
    updateFnProps: {},
    updateOverrides: [],
  };
}

export function relVarb<VN extends ValueName>(
  valueName: VN,
  partial: Partial<RelVarb<VN>> = {}
): RelVarb<VN> {
  const valueSchema = valueMetas[valueName];
  return {
    valueName,
    initValue: valueSchema.initDefault(),
    ...defaultCommon,
    ...(makeDefaultUpdateProps(valueName) as any),
    ...(valueName === "numObj" && { unit: "money" }),
    ...partial,
  } as RelVarb<VN>;
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
    return relVarb("string", updatePropsS.simple("manualUpdateOnly"));
  },
  calcVarb(
    displayName: DisplayName,
    options?: RelNumObjOptions
  ): NumObjRelVarb {
    return this.numObj(displayName, {
      ...options,
      ...updatePropsS.simple("calcVarbs"),
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
      ...updatePropsS.sumNums(nums),
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
    updateFnName: NumPropCalcName,
    num: UpdateFnProp,
    options?: RelNumObjOptions
  ): NumObjRelVarb {
    return relVarb("numObj", {
      displayName,
      ...updatePropsS.singlePropCalc(updateFnName, num),
      ...options,
    });
  },
  leftRightPropFn(
    displayName: DisplayName,
    updateFnName: LeftRightPropCalcName,
    leftRight: LeftRightVarbInfos,
    options?: RelNumObjOptions
  ): NumObjRelVarb {
    const [left, right] = leftRight;
    return relVarb("numObj", {
      displayName,
      ...updatePropsS.leftRightPropCalc(updateFnName, left, right),
      ...options,
    });
  },
};
