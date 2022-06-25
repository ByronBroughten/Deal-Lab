import { round } from "lodash";
import { isStringRationalNumber } from "./Str";

export class NotANumberError extends Error {}

export const mathS = {
  decimalToPercent,
  parseFloatStrict(str: string): number {
    const parsed = parseFloat(str);
    if (isNaN(parsed) || `${parsed}` !== str) {
      throw new NotANumberError(
        `The passed string "${str}" was parsed as "${parsed}", which is not an exact conversion.`
      );
    } else {
      return parsed;
    }
  },
  isRationalNumber(num: any): num is number {
    return typeof num === "number" && isStringRationalNumber(`${num}`);
  },
} as const;

export const arithmeticOperatorsArr = ["*", "/", "+", "-"];

export function decimalToPercent(decimal: number) {
  const percent = decimal * 100;
  return percent;
}

export const percentToDecimal = (percent: number) => {
  return percent / 100;
};

export const percentToPortion = ({
  base,
  percentOfBase,
}: {
  base: number;
  percentOfBase: number;
}) => {
  const decimalOfBase = percentToDecimal(percentOfBase);
  return base * decimalOfBase;
};

export const portionToPercent = ({
  base,
  portionOfBase,
}: {
  [varbName: string]: number;
}) => {
  const decimalOfBase = portionOfBase / base;
  return decimalToPercent(decimalOfBase);
};

export function percentToPortionPlus({
  plus,
  ...rest
}: {
  plus: number;
  base: number;
  percentOfBase: number;
}) {
  const portion = percentToPortion(rest);
  return portion + plus;
}
// I just have to calculate the base loan amount, like I'm doing, and use
// that for calculating down payments, etc.

// and then calculate the true loan amount on top of that, and use that for
// payments and stuff like that

export const roundToCents = (num: number) => {
  return round(num, 2);
};
