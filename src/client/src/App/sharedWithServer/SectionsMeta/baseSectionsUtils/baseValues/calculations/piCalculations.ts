import { CalcProp } from "../calculations";
import { calcPropMath, calcPropS } from "./calcPropS";
import { roundedS } from "./numUnitParams";
import {
  interestOnlySimpleMonthly,
  interestOnlySimpleYearly,
} from "./piCalculations/interestOnlySimple";
import {
  piFixedStandardMonthly,
  piFixedStandardYearly,
} from "./piFixedStandard";

export const piCalculationNames = [
  "interestOnlySimple",
  "piFixedStandard",
] as const;

export type PiCalculationName = typeof piCalculationNames[number];

const piCalculations = {
  yearly: {
    interestOnlySimple: interestOnlySimpleYearly,
    piFixedStandard: piFixedStandardYearly,
  },
  monthly: {
    interestOnlySimple: interestOnlySimpleMonthly,
    piFixedStandard: piFixedStandardMonthly,
  },
};

interface CalculatePiGeneralProps {
  piCalculationName: PiCalculationName;
  loanTotalDollars: CalcProp;
}
export interface CalculatePiMonthlyProps extends CalculatePiGeneralProps {
  interestRatePercentMonthly: CalcProp;
  interestRatePercentYearly: CalcProp;
  loanTermMonths: CalcProp;
}
export function calculatePiMonthly({
  piCalculationName,
  interestRatePercentMonthly,
  interestRatePercentYearly,
  ...rest
}: CalculatePiMonthlyProps) {
  const interestRateDecimalMonthly = calcPropMath(
    interestRatePercentMonthly,
    roundedS.percentToDecimal
  );

  const interestRateDecimalYearly = calcPropMath(
    interestRatePercentYearly,
    roundedS.percentToDecimal
  );

  return piCalculations.monthly[piCalculationName]({
    ...rest,
    interestRateDecimalYearly,
    interestRateDecimalMonthly,
  });
}
export interface CalculatePiYearlyProps extends CalculatePiGeneralProps {
  interestRatePercentYearly: CalcProp;
  loanTermYears: CalcProp;
}
export function calculatePiYearly({
  piCalculationName,
  interestRatePercentYearly,
  ...rest
}: CalculatePiYearlyProps): string {
  const interestRateDecimalYearly = calcPropS.percentToDecimal(
    interestRatePercentYearly
  );
  return piCalculations.yearly[piCalculationName]({
    ...rest,
    interestRateDecimalYearly,
  });
}
