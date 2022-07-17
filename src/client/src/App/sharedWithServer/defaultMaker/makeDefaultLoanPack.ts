import { SectionPack } from "../SectionPack/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export function makeDefaultLoanPack(): SectionPack<"loan"> {
  const loan = PackBuilderSection.initAsOmniChild("loan", {
    dbVarbs: {
      loanBaseUnitSwitch: "percent",
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
