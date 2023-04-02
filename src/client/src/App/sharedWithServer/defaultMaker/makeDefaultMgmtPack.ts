import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";

export function makeDefaultMgmtPack(): SectionPack<"mgmt"> {
  const mgmt = PackBuilderSection.initAsOmniChild("mgmt", {
    sectionValues: {
      basePayDollarsOngoingSwitch: "monthly",
      vacancyLossDollarsOngoingSwitch: "monthly",
      expensesOngoingSwitch: "monthly",
    },
  });
  mgmt.addChild("mgmtBasePayValue");
  mgmt.addChild("vacancyLossValue");
  mgmt.addChild("upfrontExpenseGroup");
  mgmt.addChild("ongoingExpenseGroup");
  return mgmt.makeSectionPack();
}
