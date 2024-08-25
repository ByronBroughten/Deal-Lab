import { SectionPack } from "../../SectionPacks/SectionPack";
import { numObj } from "../../stateSchemas/StateValue/NumObj";
import { stringObj } from "../../stateSchemas/StateValue/StringObj";
import { SolvePrepperSection } from "../SolvePreppers/SolvePrepperSection";
import { makeExampleLoan } from "./makeExampleLoan";

export function example20PercentDownFinancing(
  deal: SolvePrepperSection<"deal">,
  financingName: "purchaseFinancing" | "refiFinancing"
) {
  const financing = deal.onlyChild(financingName);
  financing.updateValues({ financingMethod: "useLoan" });

  const loan = financing.onlyChild("loan");
  loan.loadSelfSectionPack(example20PercentDownLoan());
}

export function example20PercentDownLoan(): SectionPack<"loan"> {
  return makeExampleLoan({
    loan: {
      displayName: stringObj("Conventional 20% Down"),
      interestRatePercentYearly: numObj(6),
      loanTermYears: numObj(30),
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
