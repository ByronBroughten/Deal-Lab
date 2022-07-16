import { CalcProp } from "../calculations";
import { calcPropS } from "./calcPropS";
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
  loanAmountDollarsTotal: CalcProp;
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
  const interestRateDecimalMonthly = calcPropS.percentToDecimal(
    interestRatePercentMonthly
  );
  const interestRateDecimalYearly = calcPropS.percentToDecimal(
    interestRatePercentYearly
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
