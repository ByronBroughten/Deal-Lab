import { round } from "lodash";
import { mathS } from "../../../../../utils/math";

export const decimalRounding = 8;
export const maxRounding = 10;

export function percentToDecimalRounded(num: number): number {
  return roundDecimal(mathS.percentToDecimal(num));
}

export function yearlyToMonthlyRounded(num: number): number {
  return roundDecimal(mathS.yearlyToMonthly(num));
}

function roundDecimal(num: number) {
  return round(num, decimalRounding);
}

export const roundS = {
  decimal: roundDecimal,
  yearlyToMonthly: yearlyToMonthlyRounded,
  percentToDecimal: percentToDecimalRounded,
  yearsToMonths: (num: number) =>
    round(mathS.yearsToMonths(num), decimalRounding),
} as const;
