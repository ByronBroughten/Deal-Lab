import { percentToDecimal } from "../../../utils/math";
import { ObjectKeys } from "../../../utils/Obj";
import { NumObjNumber } from "./NumObj";

export type Calculate = (props: any) => string;

type LRSides = { leftSide: number; rightSide: number };
export type CalcProp = NumObjNumber;
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
  piMonthly: ({
    loanAmountDollarsTotal,
    interestRatePercentMonthly,
    loanTermMonths,
  }: {
    loanAmountDollarsTotal: CalcProp;
    interestRatePercentMonthly: CalcProp;
    loanTermMonths: CalcProp;
  }) => {
    const L = loanAmountDollarsTotal;
    const r =
      typeof interestRatePercentMonthly === "number"
        ? percentToDecimal(interestRatePercentMonthly)
        : interestRatePercentMonthly;
    const n = loanTermMonths;

    // mathjs uses ^ to exponentiate instead of javascript's "**"
    const piMonthly = `${L} * ((${r} * (1 + ${r}) ^ ${n}) / ((1 + ${r}) ^ ${n} - 1))`;
    return piMonthly;
  },
  piYearly({
    // assumes monthly loan payments
    loanAmountDollarsTotal,
    interestRatePercentYearly,
    loanTermYears,
  }: {
    loanAmountDollarsTotal: CalcProp;
    interestRatePercentYearly: CalcProp;
    loanTermYears: CalcProp;
  }) {
    return `12 * (${this.piMonthly({
      loanAmountDollarsTotal,
      interestRatePercentMonthly:
        typeof interestRatePercentYearly === "number"
          ? interestRatePercentYearly / 12
          : interestRatePercentYearly,
      loanTermMonths:
        typeof loanTermYears === "number" ? loanTermYears * 12 : loanTermYears,
    })})`;
  },
} as const;

export const calculationNames = ObjectKeys(calculations);
export type CalculationName = keyof typeof calculations;
export function isCalculationName(value: any): value is CalculationName {
  return Object.keys(calculations).includes(value);
}

export default calculations;
