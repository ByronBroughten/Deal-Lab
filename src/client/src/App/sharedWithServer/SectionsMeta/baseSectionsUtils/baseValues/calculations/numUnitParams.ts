import { round } from "lodash";
import { mathS } from "../../../../utils/math";

export type NumUnitName = keyof typeof numUnitParams;
export const numUnitParams = {
  percent: { calcRound: 6, displayRound: 5 },
  decimal: { calcRound: 8, displayRound: 5 },
  money: { calcRound: 2, displayRound: 2 },
} as const;

export function percentToDecimalRounded(num: number): number {
  return round(mathS.percentToDecimal(num), numUnitParams.decimal.calcRound);
}

export function yearlyToMonthlyRounded(num: number): number {
  return round(mathS.yearlyToMonthly(num), numUnitParams.decimal.calcRound);
}

export const roundedS = {
  yearlyToMonthly: yearlyToMonthlyRounded,
  percentToDecimal: percentToDecimalRounded,
  yearsToMonths: (num: number) =>
    round(mathS.yearsToMonths(num), numUnitParams.decimal.calcRound),
} as const;
