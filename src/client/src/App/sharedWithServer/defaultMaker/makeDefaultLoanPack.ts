import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";

export function makeDefaultLoanPack(): SectionPack<"loan"> {
  const loan = PackBuilderSection.initAsOmniChild("loan", {
    sectionValues: {
      interestRatePercentPeriodicSwitch: "yearly",
      loanTermSpanSwitch: "years",
      mortgageInsPeriodicSwitch: "yearly",
    },
  });

  const baseValue = loan.addAndGetChild("loanBaseValue");
  baseValue.addChild("purchaseLoanValue");
  baseValue.addChild("repairLoanValue");
  baseValue.addChild("arvLoanValue");

  const loanExtra = baseValue.addAndGetChild("loanBaseExtra");
  loanExtra.addChild("onetimeList");
  const customBase = baseValue.addAndGetChild("customLoanBase");
  customBase.addChild("onetimeList");

  const closingCostValue = loan.addAndGetChild("closingCostValue");
  closingCostValue.addChild("onetimeList");
  return loan.makeSectionPack();
}
