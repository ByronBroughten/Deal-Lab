import { SectionPackRaw } from "../SectionPack/SectionPackRaw";
import { SectionPackBuilder } from "../StatePackers.ts/PackBuilderSection";

export function makeDefaultLoanPack(): SectionPackRaw<"loan"> {
  const main = new SectionPackBuilder();
  const loan = main.addAndGetDescendant(["analysis", "financing", "loan"], {
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
