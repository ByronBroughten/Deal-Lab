import { updateGroupS } from "../updateSectionVarbs/switchUpdateVarbs";
import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import {
  UpdateVarb,
  updateVarb,
  updateVarbS,
  uvS,
} from "../updateSectionVarbs/updateVarb";
import { ubS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import {
  updateFnPropsS,
  upS,
} from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { osS } from "../updateSectionVarbs/updateVarb/UpdateOverrideSwitch";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";

export function mgmtRelVarbs(): UpdateSectionVarbs<"mgmt"> {
  return {
    ...updateVarbsS._typeUniformity,
    ...updateVarbsS.savableSection,
    completionStatus: mgmtCompletionStatus(),
    one: updateVarbS.one(),
    ...updateGroupS.group("basePayDollars", "periodic", "monthly", {
      monthly: ubS.loadChild("mgmtBasePayValue", "valueDollarsMonthly"),
      yearly: ubS.loadChild("mgmtBasePayValue", "valueDollarsYearly"),
    }),
    basePayPercent: updateVarb(
      "numObj",
      ubS.loadChild("mgmtBasePayValue", "valuePercent")
    ),
    ...updateGroupS.group("vacancyLossDollars", "periodic", "monthly", {
      monthly: ubS.loadChild("vacancyLossValue", "valueDollarsMonthly"),
      yearly: ubS.loadChild("vacancyLossValue", "valueDollarsYearly"),
    }),
    vacancyLossPercent: updateVarb(
      "numObj",
      ubS.loadChild("vacancyLossValue", "valuePercent")
    ),
    ...updateVarbsS.group("miscCosts", "periodic", "monthly", {
      monthly: ubS.loadChild("miscOngoingCost", "valueDollarsMonthly"),
      yearly: ubS.loadChild("miscOngoingCost", "valueDollarsYearly"),
    }),

    miscOnetimeCosts: updateVarb(
      "numObj",
      ubS.loadChild("miscOnetimeCost", "valueDollars")
    ),

    ...updateVarbsS.ongoingSumNums(
      "expenses",
      updateFnPropsS.localBaseNameArr([
        "basePayDollars",
        "vacancyLossDollars",
        "miscCosts",
      ]),
      "monthly"
    ),
  };
}

function mgmtCompletionStatus(): UpdateVarb<"completionStatus"> {
  return uvS.completionStatusB({
    nonNone: [
      upS.onlyChild("mgmtBasePayValue", "valueSourceName"),
      upS.onlyChild("vacancyLossValue", "valueSourceName"),
    ],
    validInputs: [
      upS.onlyChild("mgmtBasePayValue", "valueDollarsPeriodicEditor", [
        osS.valueSourceIs("valueDollarsPeriodicEditor"),
      ]),
      upS.onlyChild("mgmtBasePayValue", "valuePercentEditor", [
        osS.valueSourceIs("percentOfRentEditor"),
      ]),
      upS.onlyChild("vacancyLossValue", "valueDollarsPeriodicEditor", [
        osS.valueSourceIs("valueDollarsPeriodicEditor"),
      ]),
      upS.onlyChild("vacancyLossValue", "valuePercentEditor", [
        osS.valueSourceIs("percentOfRentEditor"),
      ]),
    ],
  });
}
