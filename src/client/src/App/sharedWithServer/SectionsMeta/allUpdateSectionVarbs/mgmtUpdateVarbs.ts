import { updateGroupS } from "../updateSectionVarbs/switchUpdateVarbs";
import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb, updateVarbS } from "../updateSectionVarbs/updateVarb";
import { updateBasicsS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import {
  updateFnPropS,
  updateFnPropsS,
} from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import {
  overrideSwitchS,
  updateOverride,
} from "../updateSectionVarbs/updateVarb/UpdateOverrides";
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
    useCustomCosts: updateVarb("boolean", { initValue: false }),
    ...updateVarbsS.ongoingSumNumsNext("customCosts", "monthly", {
      updateFnProps: [propS.children("customOngoingExpense", "value")],
    }),
    customUpfrontCosts: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.localIsTrue("useCustomCosts")],
          basicsS.sumChildren("customUpfrontExpense", "value")
        ),
        updateOverride(
          [overrideSwitchS.localIsFalse("useCustomCosts")],
          basicsS.zero
        ),
      ],
    }),

    ...updateVarbsS.ongoingSumNums(
      "expenses",
      [
        ...updateFnPropsS.localBaseNameArr([
          "basePayDollars",
          "vacancyLossDollars",
        ]),
        propS.children("customOngoingExpense", "value", [
          overrideSwitchS.pathHasValue("mgmtFocal", "useCustomCosts", true),
        ]),
      ],
      "monthly"
    ),
  };
}
