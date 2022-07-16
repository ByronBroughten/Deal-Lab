import { CalcProp } from "../../calculations";

type InterestOnlyPaymentsYearlyProps = {
  interestRateDecimalYearly: CalcProp;
  loanAmountDollarsTotal: CalcProp;
};

export function interestOnlySimpleYearly({
  interestRateDecimalYearly,
  loanAmountDollarsTotal,
}: InterestOnlyPaymentsYearlyProps): string {
  return `${interestRateDecimalYearly} * ${loanAmountDollarsTotal}`;
}

export function interestOnlySimpleMonthly(
  props: InterestOnlyPaymentsYearlyProps
): string {
  return `${interestOnlySimpleYearly(props)} / 12`;
}
