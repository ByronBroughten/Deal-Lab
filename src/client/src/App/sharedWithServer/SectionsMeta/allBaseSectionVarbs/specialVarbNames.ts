import { Obj } from "../../utils/Obj";
import { baseVarbsS } from "./baseVarbs";

export const savableSectionVarbNames = Obj.keys(baseVarbsS.savableSection);
export const loanVarbsNotInFinancing = [
  "interestRatePercentMonthly",
  "interestRatePercentYearly",
  "interestRateDecimalMonthly",
  "interestRateDecimalYearly",
  "piFixedStandardMonthly",
  "piFixedStandardYearly",
  "interestOnlySimpleMonthly",
  "interestOnlySimpleYearly",
  "loanTermMonths",
  "loanTermYears",
  "piCalculationName",
  ...savableSectionVarbNames,
] as const;
