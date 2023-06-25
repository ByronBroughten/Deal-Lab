import { SectionPack } from "../../SectionsMeta/sectionChildrenDerived/SectionPack";
import { numObj } from "../../SectionsMeta/values/StateValue/NumObj";
import { stringObj } from "../../SectionsMeta/values/StateValue/StringObj";
import { PackBuilderSection } from "../../StatePackers/PackBuilderSection";
import { makeExampleLoan } from "./makeExampleLoan";

export function example20PercentDownFinancing(
  deal: PackBuilderSection<"deal">,
  financingName: "purchaseFinancing" | "refiFinancing"
) {
  const financing = deal.onlyChild(financingName);
  financing.updateValues({ financingMethod: "useLoan" });

  const loan = financing.onlyChild("loan");
  loan.overwriteSelf(example20PercentDownLoan());
}

export function example20PercentDownLoan(): SectionPack<"loan"> {
  return makeExampleLoan({
    loan: {
      displayName: stringObj("Conventional 20% Down"),
      interestRatePercentPeriodicEditor: numObj(6),
      loanTermSpanEditor: numObj(30),
      hasMortgageIns: false,
    },
    baseLoan: {
      valueSourceName: "purchaseLoanValue",
    },
    purchaseLoanValue: {
      offPercentEditor: numObj(20),
    },
    closingCosts: {
      valueSourceName: "valueDollarsEditor",
      valueDollarsEditor: numObj(6000),
    },
  });
}
