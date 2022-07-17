import { CalcProp } from "../../calculations";

type InterestOnlyPaymentsYearlyProps = {
  interestRateDecimalYearly: CalcProp;
  loanTotalDollars: CalcProp;
};

export function interestOnlySimpleYearly({
  interestRateDecimalYearly,
  loanTotalDollars,
}: InterestOnlyPaymentsYearlyProps): string {
  return `${interestRateDecimalYearly} * ${loanTotalDollars}`;
}

export function interestOnlySimpleMonthly(
  props: InterestOnlyPaymentsYearlyProps
): string {
  return `${interestOnlySimpleYearly(props)} / 12`;
}
