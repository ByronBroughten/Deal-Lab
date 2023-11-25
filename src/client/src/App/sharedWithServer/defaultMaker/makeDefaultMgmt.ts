import { makeDefaultMaker } from "./makeDefault";
import { makeDefaultMiscPeriodicValue } from "./makeSimpleDefaults";

export const makeDefaultMgmt = makeDefaultMaker("mgmt", (mgmt) => {
  mgmt.updateValues({
    basePayDollarsPeriodicSwitch: "monthly",
    vacancyLossDollarsPeriodicSwitch: "monthly",
    expensesPeriodicSwitch: "monthly",
  });
  mgmt.addChild("mgmtBasePayValue");
  mgmt.addChild("vacancyLossValue");
  mgmt.addChild("miscOngoingCost", {
    sectionPack: makeDefaultMiscPeriodicValue(),
  });

  const oneTimeCost = mgmt.addAndGetChild("miscOnetimeCost");
  oneTimeCost.addChild("onetimeList");
  return mgmt.makeSectionPack();
});
