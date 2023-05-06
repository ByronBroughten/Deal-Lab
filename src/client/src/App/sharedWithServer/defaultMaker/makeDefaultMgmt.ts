import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";

export function makeDefaultMgmt(): SectionPack<"mgmt"> {
  const mgmt = PackBuilderSection.initAsOmniChild("mgmt", {
    sectionValues: {
      basePayDollarsOngoingSwitch: "monthly",
      vacancyLossDollarsOngoingSwitch: "monthly",
      expensesOngoingSwitch: "monthly",
    },
  });
  mgmt.addChild("mgmtBasePayValue");
  mgmt.addChild("vacancyLossValue");
  const ongoingCost = mgmt.addAndGetChild("miscOngoingCost");
  ongoingCost.addChild("ongoingList");
  const oneTimeCost = mgmt.addAndGetChild("miscOnetimeCost");
  oneTimeCost.addChild("singleTimeList");
  return mgmt.makeSectionPack();
}
