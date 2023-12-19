import { UpdateSectionVarbs } from "../updateSectionVarbs";
import { UpdateVarb, updateVarbS, uvS } from "../updateVarb";
import { upS } from "../updateVarb/UpdateFnProps";
import { updateVarbsS, uvsS } from "../updateVarbs";

export function mgmtRelVarbs(): UpdateSectionVarbs<"mgmt"> {
  return {
    ...updateVarbsS._typeUniformity,
    ...updateVarbsS.savableSection,
    completionStatus: mgmtCompletionStatus(),
    one: updateVarbS.one(),
    ...uvsS.loadChildPeriodic(
      "basePayDollars",
      "mgmtBasePayValue",
      "valueDollars"
    ),
    basePayPercent: uvS.loadNumObjChild("mgmtBasePayValue", "valuePercent"),
    miscOnetimeCosts: uvS.loadNumObjChild("miscOnetimeCost", "valueDollars"),
    vacancyLossPercent: uvS.loadNumObjChild("vacancyLossValue", "valuePercent"),
    ...uvsS.loadChildPeriodic(
      "vacancyLossDollars",
      "vacancyLossValue",
      "valueDollars"
    ),
    ...uvsS.loadChildPeriodic("miscCosts", "miscOngoingCost", "valueDollars"),
    ...uvsS.periodicSumNums("expenses", {
      localBaseNames: ["basePayDollars", "vacancyLossDollars", "miscCosts"],
    }),
  };
}

function mgmtCompletionStatus(): UpdateVarb<"completionStatus"> {
  return uvS.completionStatusB({
    nonNone: [
      upS.onlyChild("mgmtBasePayValue", "valueSourceName"),
      upS.onlyChild("vacancyLossValue", "valueSourceName"),
    ],
    notEmptySolvable: [
      upS.local("basePayDollarsMonthly"),
      upS.local("basePayDollarsYearly"),
      upS.local("vacancyLossDollarsMonthly"),
      upS.local("vacancyLossDollarsYearly"),
    ],
  });
}
