import {
  SectionValues,
  StateValue,
} from "../../SectionsMeta/values/StateValue";
import { NumObj, numObj } from "../../SectionsMeta/values/StateValue/NumObj";
import { stringObj } from "../../SectionsMeta/values/StateValue/StringObj";
import { PackBuilderSection } from "../../StatePackers.ts/PackBuilderSection";
import { StrictPick } from "../../utils/types";
import { makeDefaultLoanPack } from "../makeDefaultLoanPack";

type ExampleLoanProps = {
  loan: StrictPick<
    SectionValues<"loan">,
    | "displayName"
    | "interestRatePercentOngoingEditor"
    | "loanTermSpanEditor"
    | "hasMortgageIns"
    | "loanAmountInputMode"
  >;
  baseLoan?: Partial<
    StrictPick<
      SectionValues<"loanBaseValue">,
      "valueSourceName" | "valuePercentEditor" | "valueDollarsEditor"
    >
  >;
  downPayment?: Partial<
    StrictPick<
      SectionValues<"downPaymentValue">,
      "valueSourceName" | "valuePercentEditor" | "valueDollarsEditor"
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

function makeExampleLoan(props: ExampleLoanProps) {
  const loan = PackBuilderSection.initAsOmniChild("loan");
  loan.loadSelf(makeDefaultLoanPack());
  loan.updateValues({
    ...props.loan,
    interestRatePercentOngoingSwitch: "yearly",
    loanTermSpanSwitch: "years",
  });
  const loanBaseValue = loan.onlyChild("loanBaseValue");
  loanBaseValue.updateValues({ ...props.baseLoan });

  const closingCostValue = loan.onlyChild("closingCostValue");
  const { items = [], ...costProps } = props.closingCosts;
  closingCostValue.updateValues(costProps);
  const closingCostList = closingCostValue.onlyChild("singleTimeList");
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

export const dealExampleLoan = makeExampleLoan({
  loan: {
    displayName: stringObj("Conventional 20% LTV"),
    interestRatePercentOngoingEditor: numObj(6),
    loanTermSpanEditor: numObj(30),
    hasMortgageIns: false,
    loanAmountInputMode: "loanAmount",
  },
  baseLoan: {
    valueSourceName: "percentOfAssetEditor",
    valuePercentEditor: numObj(80),
  },
  closingCosts: {
    valueSourceName: "valueEditor",
    valueDollarsEditor: numObj(6000),
  },
});
