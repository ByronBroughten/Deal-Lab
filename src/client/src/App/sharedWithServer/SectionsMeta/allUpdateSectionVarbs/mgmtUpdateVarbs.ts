import { updateGroupS } from "../updateSectionVarbs/switchUpdateVarbs";
import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb, updateVarbS } from "../updateSectionVarbs/updateVarb";
import { updateBasicsS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import {
  updateFnPropS,
  updateFnPropsS,
} from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";

const propS = updateFnPropS;
const basicsS = updateBasicsS;
export function mgmtRelVarbs(): UpdateSectionVarbs<"mgmt"> {
  return {
    ...updateVarbsS._typeUniformity,
    ...updateVarbsS.savableSection,
    one: updateVarbS.one(),
    ...updateGroupS.group("basePayDollars", "ongoing", "monthly", {
      monthly: basicsS.loadFromChild("mgmtBasePayValue", "valueDollarsMonthly"),
      yearly: basicsS.loadFromChild("mgmtBasePayValue", "valueDollarsYearly"),
    }),
    basePayPercent: updateVarb(
      "numObj",
      basicsS.loadFromChild("mgmtBasePayValue", "valuePercent")
    ),
    ...updateGroupS.group("vacancyLossDollars", "ongoing", "monthly", {
      monthly: basicsS.loadFromChild("vacancyLossValue", "valueDollarsMonthly"),
      yearly: basicsS.loadFromChild("vacancyLossValue", "valueDollarsYearly"),
    }),
    vacancyLossPercent: updateVarb(
      "numObj",
      basicsS.loadFromChild("vacancyLossValue", "valuePercent")
    ),
    ...updateVarbsS.group("miscCosts", "ongoing", "monthly", {
      monthly: basicsS.loadFromChild("miscOngoingCost", "valueDollarsMonthly"),
      yearly: basicsS.loadFromChild("miscOngoingCost", "valueDollarsYearly"),
    }),

    miscOnetimeCosts: updateVarb(
      "numObj",
      basicsS.loadFromChild("miscOnetimeCost", "valueDollars")
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
