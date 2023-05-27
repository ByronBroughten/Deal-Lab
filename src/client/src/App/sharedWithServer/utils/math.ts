import { round } from "lodash";
//@ts-ignore
import { create, evaluateDependencies } from "mathjs/lib/esm/number"; // esm or cjs
import { ValidationError } from "./Error";
import { isStringRationalNumber } from "./Str";
// // @ts-ignore
// const { create, evaluateDependencies } = await import("mathjs/lib/esm/number");

const mathjs = create(evaluateDependencies);
const add = (a: number, b: number) => a + b;
const subtract = (a: number, b: number) => a - b;
const multiply = (a: number, b: number) => a * b;
const divide = (a: number, b: number) => a / b;
const pow = (a: number, b: number) => a ** b;

mathjs.import({ add, subtract, multiply, divide, pow }, { override: true });
export const evaluate = (numText: string) => {
  return mathjs.evaluate(numText);
};

export class NotANumberError extends Error {}

export const mathS = {
  yearlyToMonthly,
  yearsToMonths,
  decimalToPercent,
  percentToDecimal,
  validateNumber,
  isNumber,
  parseFloatStrict(str: string): number {
    const parsed = parseFloat(str);
    if (isNaN(parsed)) {
      throw new NotANumberError(`The passed string ${str} was parsed as NaN.`);
    }
    if (`${parsed}` !== str) {
      throw new NotANumberError(
        `The passed string "${str}" was parsed as "${parsed}", which is not an exact conversion.`
      );
    }
    return parsed;
  },
  isRationalNumber(num: any): num is number {
    return typeof num === "number" && isStringRationalNumber(`${num}`);
  },
} as const;

export function yearlyToMonthly(yearly: number): number {
  // monthly payments are 1/12th of a yearly payment.
  return yearly / 12;
}
export function yearsToMonths(years: number): number {
  // one year is 12 months
  return years * 12;
}

export function isNumber(v: any): v is number {
  return typeof v === "number";
}
export function validateNumber(v: any): number {
  if (typeof v === "number") return v;
  else {
    throw new ValidationError(`value "${v}" is not a number`);
  }
}

export const arithmeticOperatorsArr = ["*", "/", "+", "-"];

export function decimalToPercent(decimal: number) {
  const percent = decimal * 100;
  return percent;
}

export function percentToDecimal(percent: number) {
  return percent / 100;
}

export const portionToPercent = ({
  base,
  portionOfBase,
}: {
  [varbName: string]: number;
}) => {
  const decimalOfBase = portionOfBase / base;
  return decimalToPercent(decimalOfBase);
};

export const roundToCents = (num: number) => {
  return round(num, 2);
};
