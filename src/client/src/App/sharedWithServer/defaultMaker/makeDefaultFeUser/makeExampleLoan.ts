import {
  SectionValues,
  StateValue,
} from "../../SectionsMeta/values/StateValue";
import { NumObj } from "../../SectionsMeta/values/StateValue/NumObj";
import { PackBuilderSection } from "../../StatePackers/PackBuilderSection";
import { StrictPick } from "../../utils/types";
import { makeDefaultLoanPack } from "../makeDefaultLoanPack";

type ExampleLoanProps = {
  loan: StrictPick<
    SectionValues<"loan">,
    | "displayName"
    | "interestRatePercentPeriodicEditor"
    | "loanTermSpanEditor"
    | "hasMortgageIns"
    | "loanAmountInputMode"
  >;
  purchaseLoanValue?: StrictPick<
    SectionValues<"purchaseLoanValue">,
    "offPercentEditor"
  >;
  baseLoan?: Partial<
    StrictPick<
      SectionValues<"loanBaseValue">,
      "valueSourceName" | "valueDollarsEditor"
    >
  >;
  closingCosts: {
    valueSourceName: StateValue<"closingCostValueSource">;
    valueDollarsEditor?: NumObj;
    items?: {
      displayName: string;
      value: NumObj;
    }[];
  };
};

export function makeExampleLoan(props: ExampleLoanProps) {
  const loan = PackBuilderSection.initAsOmniChild("loan");
  loan.loadSelf(makeDefaultLoanPack());
  loan.updateValues({
    ...props.loan,
    interestRatePercentPeriodicSwitch: "yearly",
    loanTermSpanSwitch: "years",
  });
  const loanBaseValue = loan.onlyChild("loanBaseValue");
  loanBaseValue.updateValues({
    valueSourceName: "purchaseLoanValue",
    ...props.baseLoan,
  });

  const purchaseValue = loanBaseValue.onlyChild("purchaseLoanValue");
  purchaseValue.updateValues({
    ...props.purchaseLoanValue,
    valueSourceName: "offPercentEditor",
  });

  const closingCostValue = loan.onlyChild("closingCostValue");
  const { items = [], ...costProps } = props.closingCosts;
  closingCostValue.updateValues(costProps);
  const closingCostList = closingCostValue.onlyChild("onetimeList");
  for (const item of items) {
    const closingCostItem = closingCostList.addAndGetChild("singleTimeItem");
    closingCostItem.updateValues({
      displayNameEditor: item.displayName,
      valueEditor: item.value,
      valueSourceName: "valueEditor",
    });
  }
  return loan.makeSectionPack();
}
