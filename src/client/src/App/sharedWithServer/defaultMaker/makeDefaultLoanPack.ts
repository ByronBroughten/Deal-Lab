import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";

export function makeDefaultLoanPack(): SectionPack<"loan"> {
  const loan = PackBuilderSection.initAsOmniChild("loan", {
    sectionValues: {
      interestRatePercentOngoingSwitch: "yearly",
      loanTermSpanSwitch: "years",
      mortgageInsOngoingSwitch: "yearly",
      loanAmountInputMode: "loanAmount",
    },
  });
  loan.addChild("downPaymentValue");
  const baseValue = loan.addAndGetChild("loanBaseValue");
  baseValue.addChild("purchasePriceLoanValue");
  baseValue.addChild("repairLoanValue");
  baseValue.addChild("arvLoanValue");

  const closingCostValue = loan.addAndGetChild("closingCostValue");
  closingCostValue.addChild("singleTimeList");
  return loan.makeSectionPack();
}
