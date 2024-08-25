import { SectionValues, StateValue } from "../../stateSchemas/StateValue";
import { NumObj } from "../../stateSchemas/StateValue/NumObj";
import { StrictPick } from "../../utils/types";
import { makeExample } from "./makeExample";

type ExampleLoanProps = {
  loan: StrictPick<
    SectionValues<"loan">,
    | "displayName"
    | "interestRatePercentYearly"
    | "loanTermYears"
    | "hasMortgageIns"
  >;
  purchaseLoanValue?: StrictPick<
    SectionValues<"purchaseLoanValue">,
    "offPercentEditor"
  >;
  baseLoan?: Partial<
    StrictPick<SectionValues<"loanBaseValue">, "valueSourceName">
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
  return makeExample("loan", (loan) => {
    const { interestRatePercentYearly, loanTermYears, ...loanProps } =
      props.loan;
    loan.updateValues(loanProps);

    loan.onlyChild("interestRateEditor").updateValues({
      valueEditor: interestRatePercentYearly,
      valueEditorFrequency: "yearly",
    });

    loan.onlyChild("loanTermEditor").updateValues({
      valueEditor: loanTermYears,
      valueEditorUnit: "years",
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
      const closingCostItem = closingCostList.addAndGetChild("onetimeItem");
      closingCostItem.updateValues({
        displayNameEditor: item.displayName,
        valueDollarsEditor: item.value,
        valueSourceName: "valueDollarsEditor",
      });
    }
  });
}
