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
      monthly: ubS.loadFromChild("mgmtBasePayValue", "valueDollarsMonthly"),
      yearly: ubS.loadFromChild("mgmtBasePayValue", "valueDollarsYearly"),
    }),
    basePayPercent: updateVarb(
      "numObj",
      ubS.loadFromChild("mgmtBasePayValue", "valuePercent")
    ),
    ...updateGroupS.group("vacancyLossDollars", "periodic", "monthly", {
      monthly: ubS.loadFromChild("vacancyLossValue", "valueDollarsMonthly"),
      yearly: ubS.loadFromChild("vacancyLossValue", "valueDollarsYearly"),
    }),
    vacancyLossPercent: updateVarb(
      "numObj",
      ubS.loadFromChild("vacancyLossValue", "valuePercent")
    ),
    ...updateVarbsS.group("miscCosts", "periodic", "monthly", {
      monthly: ubS.loadFromChild("miscOngoingCost", "valueDollarsMonthly"),
      yearly: ubS.loadFromChild("miscOngoingCost", "valueDollarsYearly"),
    }),

    miscOnetimeCosts: updateVarb(
      "numObj",
      ubS.loadFromChild("miscOnetimeCost", "valueDollars")
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
