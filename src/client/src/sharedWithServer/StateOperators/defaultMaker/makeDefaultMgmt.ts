import { makeDefaultMaker } from "./makeDefault";
import { makeDefaultMiscPeriodicValue } from "./makeSimpleDefaults";

export const makeDefaultMgmt = makeDefaultMaker("mgmt", (mgmt) => {
  const basePay = mgmt.addAndGetChild("mgmtBasePayValue");
  basePay.addChild("valueDollarsEditor", {
    sectionValues: { valueEditorFrequency: "monthly" },
  });
  const vacancyLoss = mgmt.addAndGetChild("vacancyLossValue");
  vacancyLoss.addChild("valueDollarsEditor", {
    sectionValues: { valueEditorFrequency: "monthly" },
  });

  mgmt.addChild("miscOngoingCost", {
    sectionPack: makeDefaultMiscPeriodicValue(),
  });

  const oneTimeCost = mgmt.addAndGetChild("miscOnetimeCost");
  oneTimeCost.addChild("onetimeList");
});
