import { SectionPack } from "../SectionPack/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export function makeDefaultLoanPack(): SectionPack<"loan"> {
  const main = PackBuilderSection.initAsMain();
  const loan = main.addAndGetDescendant(["deal", "financing", "loan"], {
    dbVarbs: {
      loanAmountBaseUnitSwitch: "percent",
      interestRatePercentOngoingSwitch: "yearly",
      loanTermSpanSwitch: "years",
      mortgageInsOngoingSwitch: "yearly",
    },
  });
  loan.addChild("closingCostList", {
    dbVarbs: {
      title: "Closing Costs",
      defaultValueSwitch: "labeledEquation",
    },
  });
  return loan.makeSectionPack();
}
