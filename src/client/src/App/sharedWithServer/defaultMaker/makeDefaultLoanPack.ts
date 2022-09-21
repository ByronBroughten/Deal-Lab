import { stringObj } from "../SectionsMeta/baseSectionsVarbs/baseValues/StringObj";
import { SectionPack } from "../SectionsMeta/childSectionsDerived/SectionPack";
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
  loan.addChild("wrappedInLoanListGroup");
  const closingCostList = loan.addAndGetChild("closingCostListGroup");
  closingCostList.addChild("singleTimeList", {
    dbVarbs: {
      displayName: stringObj("Closing Costs"),
      defaultValueSwitch: "labeledEquation",
    },
  });
  return loan.makeSectionPack();
}
