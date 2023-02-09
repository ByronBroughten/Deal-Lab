import { CalcProp } from "../../calculations";

type InterestOnlyPaymentsYearlyProps = {
  interestRateDecimalYearly: CalcProp;
  loanTotalDollars: CalcProp;
};

export function piInterestOnlySimpleYearly({
  interestRateDecimalYearly,
  loanTotalDollars,
}: InterestOnlyPaymentsYearlyProps): string {
  return `${interestRateDecimalYearly} * ${loanTotalDollars}`;
}

export function piInterestOnlySimpleMonthly(
  props: InterestOnlyPaymentsYearlyProps
): string {
  return `${piInterestOnlySimpleYearly(props)} / 12`;
}
