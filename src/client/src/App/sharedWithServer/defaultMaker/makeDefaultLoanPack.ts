import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

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
  loan.addAndGetChild("loanBaseValue");
  const closingCostValue = loan.addAndGetChild("closingCostValue");
  closingCostValue.addChild("singleTimeList");
  return loan.makeSectionPack();
}
