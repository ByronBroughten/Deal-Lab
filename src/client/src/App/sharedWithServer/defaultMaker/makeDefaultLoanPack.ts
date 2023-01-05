import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { makeDefaultOneTimeValue } from "./makeDefaultOneTimeValue";

export function makeDefaultLoanPack(): SectionPack<"loan"> {
  const loan = PackBuilderSection.initAsOmniChild("loan", {
    dbVarbs: {
      loanBaseUnitSwitch: "percent",
      interestRatePercentOngoingSwitch: "yearly",
      loanTermSpanSwitch: "years",
      mortgageInsOngoingSwitch: "yearly",
    },
  });
  loan.loadChild({
    childName: "closingCostValue",
    sectionPack: makeDefaultOneTimeValue(),
  });
  return loan.makeSectionPack();
}
