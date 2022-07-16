import { yearlyToMonthly, yearsToMonths } from "../../../../utils/math";
import { CalcProp } from "../calculations";
import { calcPropMath } from "./calcPropS";

interface PiYearlyFullProps extends PiYearlyCalcProps {
  loanAmountDollarsTotal: CalcProp;
}

export function piFixedStandardYearly({
  // the yearly total assumes that payments are made monthly
  loanAmountDollarsTotal,
  ...yearlyCalcProps
}: PiYearlyFullProps) {
  const monthlyCalcProps = yearlyToMonthlyCalcProps(yearlyCalcProps);
  return `12 * (${piFixedStandardMonthly({
    loanAmountDollarsTotal,
    ...monthlyCalcProps,
  })})`;
}

type PiMonthlyFullProps = {
  loanAmountDollarsTotal: CalcProp;
  interestRateDecimalMonthly: CalcProp;
  loanTermMonths: CalcProp;
};
export function piFixedStandardMonthly({
  loanAmountDollarsTotal,
  interestRateDecimalMonthly,
  loanTermMonths,
}: PiMonthlyFullProps): string {
  const L = loanAmountDollarsTotal;
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
      yearlyToMonthly
    ),
    loanTermMonths: calcPropMath(loanTermYears, yearsToMonths),
  };
}
