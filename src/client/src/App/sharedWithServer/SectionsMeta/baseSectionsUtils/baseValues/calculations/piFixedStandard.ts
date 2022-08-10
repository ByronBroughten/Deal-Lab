import { CalcProp } from "../calculations";
import { calcPropMath } from "./calcPropS";
import { roundedS } from "./numUnitParams";

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
  // loanTermMonths (360)
  // interest rate decimal must be the difference
}

type PiMonthlyFullProps = {
  loanTotalDollars: CalcProp;
  interestRateDecimalMonthly: CalcProp;
  loanTermMonths: CalcProp;
};
// 0.0041666666667
// 0.0042

// Hmmm... How do I want to handle that?
// every calculation could have a "displayCalculation" and a
// number calculation.
// I don't like that, though.

// A consistent number calculation would be better.
// interestRateDecimalMonthly could be allowed to
// be rounded further.

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
