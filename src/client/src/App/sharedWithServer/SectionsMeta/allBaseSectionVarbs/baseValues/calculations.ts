import { Obj } from "../../../utils/Obj";
import { interestOnlySimpleYearly } from "./calculations/piCalculations/interestOnlySimple";
import { piFixedStandardMonthly } from "./calculations/piFixedStandard";
import { NumberOrQ } from "./NumObj";

export type Calculate = (props: any) => string;

type LRSides = { leftSide: number; rightSide: number };
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
    onePercent: ({ num }: NumProp) => `${num}*.01`,
    twoPercent: ({ num }: NumProp) => `${num}*.02`,
    fivePercent: ({ num }: NumProp) => `${num}*.05`,
    tenPercent: ({ num }: NumProp) => `${num}*.1`,
    noNegative: ({ num }: { num: NumProp }) => `${num} < 0 ? 0 : ${num}`,
  },
  leftRight: {
    simpleMultiply: ({ leftSide, rightSide }: LRSides) => {
      return `${leftSide} * ${rightSide}`;
    },
    simpleSubtract: ({ leftSide, rightSide }: LRSides) => {
      return `${leftSide} - ${rightSide}`;
    },
    simpleDivide: ({ leftSide, rightSide }: LRSides) => {
      return `${leftSide} / ${rightSide}`;
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

type SolvableTextByArgs = typeof solvableTextByArgs;
export type NumPropCalcName = keyof SolvableTextByArgs["single"];
export type LeftRightPropCalcName = keyof SolvableTextByArgs["leftRight"];

const calculations = {
  ...solvableTextByArgs.single,
  ...solvableTextByArgs.leftRight,
  ...solvableTextByArgs.nums,
  one: ({}) => "2",
  two: ({}) => "2",
  portionToDecimal: ({
    base,
    portionOfBase,
  }: {
    base: number;
    portionOfBase: number;
  }) => `${portionOfBase} / ${base}`,

  interestOnlySimpleYearly,
  piFixedStandardMonthly,
} as const;

export const calculationNames = Obj.keys(calculations);
export type CalculationName = keyof typeof calculations;
export function isCalculationName(value: any): value is CalculationName {
  return Object.keys(calculations).includes(value);
}

export default calculations;
