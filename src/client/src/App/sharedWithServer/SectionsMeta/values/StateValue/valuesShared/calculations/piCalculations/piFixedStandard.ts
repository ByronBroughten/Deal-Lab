import { CalcProp } from "../../calculations";
import { calcPropMath } from "../calcPropS";
import { roundedS } from "../numUnitParams";

interface PiYearlyFullProps extends PiYearlyCalcProps {
  loanTotalDollars: CalcProp;
}

export function piFixedStandardYearly({
  // the yearly total assumes that payments are made monthly
  loanTotalDollars,
  ...yearlyCalcProps
}: PiYearlyFullProps) {
  const monthlyCalcProps = yearlyToMonthlyCalcProps(yearlyCalcProps);
  return `12 * (${piFixedStandardMonthly({
    loanTotalDollars,
    ...monthlyCalcProps,
  })})`;
}

type PiMonthlyFullProps = {
  loanTotalDollars: CalcProp;
  interestRateDecimalMonthly: CalcProp;
  loanTermMonths: CalcProp;
};

export function piFixedStandardMonthly({
  loanTotalDollars,
  interestRateDecimalMonthly,
  loanTermMonths,
}: PiMonthlyFullProps): string {
  const L = loanTotalDollars;
  const r = interestRateDecimalMonthly;
  const n = loanTermMonths;

  // mathjs uses ^ to exponentiate rather than javascript's "**"
  return `${L} * ((${r} * (1 + ${r}) ^ ${n}) / ((1 + ${r}) ^ ${n} - 1))`;
}

interface PiYearlyCalcProps {
  interestRateDecimalYearly: CalcProp;
  loanTermYears: CalcProp;
}
interface PiMonthlyCalcProps {
  interestRateDecimalMonthly: CalcProp;
  loanTermMonths: CalcProp;
}
function yearlyToMonthlyCalcProps({
  interestRateDecimalYearly,
  loanTermYears,
}: PiYearlyCalcProps): PiMonthlyCalcProps {
  return {
    interestRateDecimalMonthly: calcPropMath(
      interestRateDecimalYearly,
      roundedS.yearlyToMonthly
    ),
    loanTermMonths: calcPropMath(loanTermYears, roundedS.yearsToMonths),
  };
}
