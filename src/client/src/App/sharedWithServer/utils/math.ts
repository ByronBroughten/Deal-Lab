import { round } from "lodash";

export const MathUtils = {
  decimalToPercent,
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
