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
    | "loanBasePercentEditor"
    | "loanTermSpanEditor"
    | "hasMortgageIns"
  >;
  closingCosts: {
    valueSourceName: StateValue<"closingCostValueSource">;
    valueLumpSumEditor?: NumObj;
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
    loanBaseUnitSwitch: "percent",
    loanTermSpanSwitch: "years",
  });

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
    displayName: stringObj("Conventional 80% LTV"),
    interestRatePercentOngoingEditor: numObj(6),
    loanBasePercentEditor: numObj(80),
    loanTermSpanEditor: numObj(30),
    hasMortgageIns: false,
  },
  closingCosts: {
    valueSourceName: "valueEditor",
    valueLumpSumEditor: numObj(6000),
  },
});
