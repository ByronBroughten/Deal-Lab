import { SectionPack } from "../SectionsMeta/childSectionsDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { stringObj } from "./../SectionsMeta/baseSectionsUtils/baseValues/StringObj";

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
      displayName: stringObj("Closing Costs"),
      defaultValueSwitch: "labeledEquation",
    },
  });
  return loan.makeSectionPack();
}
