import { round } from "lodash";
import { mathS } from "../../../../utils/math";

export type NumUnitName = keyof typeof numUnitParams;
export const numUnitParams = {
  percent: { roundTo: 6, displayRound: 3 },
  decimal: { roundTo: 8, displayRound: 3 },
  money: { roundTo: 2, displayRound: 2 },
} as const;

export function percentToDecimalRounded(num: number): number {
  return round(mathS.percentToDecimal(num), numUnitParams.decimal.roundTo);
}

export function yearlyToMonthlyRounded(num: number): number {
  return round(mathS.yearlyToMonthly(num), numUnitParams.decimal.roundTo);
}

export const roundedS = {
  yearlyToMonthly: yearlyToMonthlyRounded,
  percentToDecimal: percentToDecimalRounded,
  yearsToMonths: (num: number) =>
    round(mathS.yearsToMonths(num), numUnitParams.decimal.roundTo),
} as const;
