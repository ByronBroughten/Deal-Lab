import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { FinancingMode } from "../SectionsMeta/values/StateValue/financingMode";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";

export function makeDefaultLoanPack(
  financingMode?: FinancingMode
): SectionPack<"loan"> {
  const loan = PackBuilderSection.initAsOmniChild("loan", {
    sectionValues: {
      interestRatePercentPeriodicSwitch: "yearly",
      loanTermSpanSwitch: "years",
      mortgageInsPeriodicSwitch: "yearly",
      ...(financingMode && { financingMode }),
    },
  });

  financingMode = loan.get.valueNext("financingMode");
  const baseValue = loan.addAndGetChild("loanBaseValue", {
    sectionValues: {
      financingMode,
      valueSourceName:
        financingMode === "purchase" ? "purchaseLoanValue" : "arvLoanValue",
    },
  });

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
