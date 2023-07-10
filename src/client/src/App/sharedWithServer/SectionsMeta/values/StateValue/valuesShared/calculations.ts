import { isNumber, mathS } from "../../../../utils/math";
import { Obj } from "../../../../utils/Obj";
import { NumberOrQ } from "../NumObj";
import { roundS } from "./calculations/numUnitParams";
import { piFixedStandardMonthly } from "./calculations/piCalculations/piFixedStandard";
import { piInterestOnlySimpleYearly } from "./calculations/piCalculations/piInterestOnlySimple";

export type Calculate = (props: any) => string;

type LRSides = { leftSide: CalcProp; rightSide: CalcProp };
export type CalcProp = NumberOrQ;
export type NumberProps = { [name: string]: CalcProp | CalcProp[] };

type NumProp = { num: CalcProp };
const solvableTextByArgs = {
  single: {
    solvableText: ({ num }: NumProp) => `${num}`,
    monthlyToYearly: ({ num }: NumProp) => `${num} * 12`,
    yearlyToMonthly: ({ num }: NumProp) => `${num} / 12`,
    yearsToMonths: ({ num }: NumProp) => `${num} * 12`,
    monthsToYears: ({ num }: NumProp) => `${num} / 12`,
    decimalToPercent: ({ num }: NumProp) => `${num} * 100`,
    percentToDecimal: ({ num }: NumProp) => `${num} / 100`,
    oneHundredMinus: ({ num }: NumProp) => `100 - ${num}`,
    onePercent: ({ num }: NumProp) => `${num}*.01`,
    twoPercent: ({ num }: NumProp) => `${num}*.02`,
    fivePercent: ({ num }: NumProp) => `${num}*.05`,
    tenPercent: ({ num }: NumProp) => `${num}*.1`,
    noNegative: ({ num }: { num: NumProp }) => `${num} < 0 ? 0 : ${num}`,
  },
  leftRight: {
    larger: ({ leftSide, rightSide }: LRSides) => {
      if (isNumber(leftSide) && isNumber(rightSide)) {
        if (leftSide >= rightSide) {
          return `${leftSide}`;
        } else {
          return `${rightSide}`;
        }
      } else return "?";
    },
    multiply: ({ leftSide, rightSide }: LRSides) => {
      return `${leftSide} * ${rightSide}`;
    },
    add: ({ leftSide, rightSide }: LRSides) => {
      return `${leftSide} + ${rightSide}`;
    },
    subtract: ({ leftSide, rightSide }: LRSides) => {
      return `${leftSide} - ${rightSide}`;
    },
    subtractFloorZero: ({ leftSide, rightSide }: LRSides) => {
      let baseEquation = `${leftSide} - ${rightSide}`;
      if (isNumber(leftSide) && isNumber(rightSide)) {
        const subtracted = roundS.decimal(leftSide - rightSide);
        if (mathS.isRationalNumber(subtracted) && subtracted < 0) {
          baseEquation = `(${baseEquation}) * 0`;
        }
      }
      return baseEquation;
    },
    divide: ({ leftSide, rightSide }: LRSides) => {
      return `${leftSide} / ${rightSide}`;
    },
  },
  nums: {
    sumNums: ({ nums }: { nums: CalcProp[] }) => {
      let solvableText = "";
      for (let num of nums) {
        if (num === "?") continue;
        if (solvableText === "") {
          solvableText = `${num}`;
        } else {
          solvableText = solvableText + `+${num}`;
        }
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

type SolvableTextByArgs = typeof solvableTextByArgs;
export type NumPropCalcName = keyof SolvableTextByArgs["single"];
export type LeftRightPropCalcName = keyof SolvableTextByArgs["leftRight"];

const calculations = {
  ...solvableTextByArgs.single,
  ...solvableTextByArgs.leftRight,
  ...solvableTextByArgs.nums,
  one: (_: any) => "1",
  two: (_: any) => "2",
  six: (_: any) => "6",
  twelve: (_: any) => "12",
  portionToDecimal: ({
    base,
    portionOfBase,
  }: {
    base: number;
    portionOfBase: number;
  }) => `${portionOfBase} / ${base}`,

  piInterestOnlySimpleYearly,
  piFixedStandardMonthly,
} as const;

export const calculationNames = Obj.keys(calculations);
export type CalculationName = keyof typeof calculations;
export function isCalculationName(value: any): value is CalculationName {
  return Object.keys(calculations).includes(value);
}

export default calculations;
