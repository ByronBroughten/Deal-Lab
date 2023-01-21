import { round } from "lodash";
import { mathS } from "../../../../utils/math";

export const decimalRounding = 8;
export const maxRounding = 10;

export function percentToDecimalRounded(num: number): number {
  return round(mathS.percentToDecimal(num), decimalRounding);
}

export function yearlyToMonthlyRounded(num: number): number {
  return round(mathS.yearlyToMonthly(num), decimalRounding);
}

export const roundedS = {
  yearlyToMonthly: yearlyToMonthlyRounded,
  percentToDecimal: percentToDecimalRounded,
  yearsToMonths: (num: number) =>
    round(mathS.yearsToMonths(num), decimalRounding),
} as const;
