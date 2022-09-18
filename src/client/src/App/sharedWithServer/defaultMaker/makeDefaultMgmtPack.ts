import { SectionPack } from "../SectionsMeta/childSectionsDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";

export function makeDefaultMgmtPack(): SectionPack<"mgmt"> {
  const mgmt = PackBuilderSection.initAsOmniChild("mgmt", {
    dbVarbs: {
      rentCutUnitSwitch: "percent",
      rentCutDollarsOngoingSwitch: "monthly",
      vacancyLossDollarsOngoingSwitch: "monthly",
      expensesOngoingSwitch: "monthly",
    },
  });
  mgmt.addChild("upfrontCostListGroup");
  mgmt.addChild("ongoingCostListGroup");
  return mgmt.makeSectionPack();
}
