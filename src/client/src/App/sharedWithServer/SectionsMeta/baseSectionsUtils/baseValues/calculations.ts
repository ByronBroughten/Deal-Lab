import { percentToDecimal } from "../../../utils/math";
import { Obj } from "../../../utils/Obj";
import {
  calculatePiMonthly,
  calculatePiYearly,
} from "./calculations/piCalculations";
import { NumberOrQ } from "./NumObj";

export type Calculate = (props: any) => string;

type LRSides = { leftSide: number; rightSide: number };
export type CalcProp = NumberOrQ;
export type NumberProps = { [name: string]: CalcProp | CalcProp[] };

type NumProp = { num: CalcProp };
const solvableTextByArgs = {
  single: {
    monthlyToYearly: ({ num }: NumProp) => `${num} * 12`,
    yearlyToMonthly: ({ num }: NumProp) => `${num} / 12`,
    yearsToMonths: ({ num }: NumProp) => `${num} * 12`,
    monthsToYears: ({ num }: NumProp) => `${num} / 12`,
    decimalToPercent: ({ num }: NumProp) => `${num} * 100`,
    percentToDecimal: ({ num }: NumProp) => `${num} / 100`,

    noNegative: ({ num }: { num: NumProp }) => `${num} < 0 ? 0 : ${num}`,
  },
  leftRight: {
    simpleSubtract: ({ leftSide, rightSide }: LRSides) => {
      return `${leftSide} - ${rightSide}`;
    },
    simpleDivide: ({ leftSide, rightSide }: LRSides) => {
      return `${leftSide} / ${rightSide}`;
    },

    get divideToPercent() {
      // This is converted to a percent in numObj, in "finishing touches"
      // to make the displayed computation less confusing for people.
      return this.simpleDivide;
    },
    percentToDecimalTimesBase: ({ leftSide, rightSide }: LRSides) => {
      const decimalLeft = percentToDecimal(leftSide);
      return `${decimalLeft} * ${rightSide}`;
    },
    subtractFloorZero: ({ leftSide, rightSide }: LRSides) => {
      const num = leftSide - rightSide;
      return num > 0 ? `${num}` : `0`;
    },
  },
  nums: {
    sumNums: ({ nums }: { nums: CalcProp[] }) => {
      let solvableText = "";
      for (let num of nums) {
        if (num === "?") continue;
        if (solvableText === "") solvableText = `${num}`;
        else solvableText = solvableText + `+${num}`;
      }
      if (!solvableText) solvableText = "0";
      return solvableText;
    },
    multiplyNums: ({ nums }: { nums: number[] }) => {
      let solvableText = "";
      for (const [idx, num] of Object.entries(nums)) {
        if (idx === "0") solvableText = solvableText + `${num}`;
        else solvableText = solvableText + `* ${num}`;
      }
      if (!solvableText) solvableText = "0";
      return solvableText;
    },
  },
} as const;

type solvableTextByArgs = typeof solvableTextByArgs;
export type SinglePropCalculations = keyof solvableTextByArgs["single"];
export type LeftRightPropCalculations = keyof solvableTextByArgs["leftRight"];

const calculations = {
  ...solvableTextByArgs.single,
  ...solvableTextByArgs.leftRight,
  ...solvableTextByArgs.nums,
  one: ({}) => `1`,
  percentToPortion: ({
    base,
    percentOfBase,
  }: {
    base: number;
    percentOfBase: number;
  }) => {
    const decimalOfBase = percentToDecimal(percentOfBase);
    return `${base} * ${decimalOfBase}`;
  },
  portionToDecimal: ({
    base,
    portionOfBase,
  }: {
    base: number;
    portionOfBase: number;
  }) => `${portionOfBase} / ${base}`,
  piMonthly: calculatePiMonthly,
  piYearly: calculatePiYearly,
} as const;

export const calculationNames = Obj.keys(calculations);
export type CalculationName = keyof typeof calculations;
export function isCalculationName(value: any): value is CalculationName {
  return Object.keys(calculations).includes(value);
}

export default calculations;
