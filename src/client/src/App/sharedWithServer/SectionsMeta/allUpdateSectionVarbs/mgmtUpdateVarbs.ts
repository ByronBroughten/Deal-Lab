import { updateGroupS } from "../updateSectionVarbs/switchUpdateVarbs";
import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb, updateVarbS } from "../updateSectionVarbs/updateVarb";
import { updateBasicsS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import {
  updateFnPropS,
  updateFnPropsS,
} from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { overrideSwitchS } from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";

export function mgmtRelVarbs(): UpdateSectionVarbs<"mgmt"> {
  return {
    ...updateVarbsS._typeUniformity,
    ...updateVarbsS.savableSection,
    one: updateVarbS.one(),
    ...updateGroupS.group("basePayDollars", "ongoing", "monthly", {
      monthly: updateBasicsS.loadFromChild(
        "mgmtBasePayValue",
        "valueDollarsMonthly"
      ),
      yearly: updateBasicsS.loadFromChild(
        "mgmtBasePayValue",
        "valueDollarsYearly"
      ),
    }),
    basePayPercent: updateVarb(
      "numObj",
      updateBasicsS.loadFromChild("mgmtBasePayValue", "valuePercent")
    ),
    ...updateGroupS.group("vacancyLossDollars", "ongoing", "monthly", {
      monthly: updateBasicsS.loadFromChild(
        "vacancyLossValue",
        "valueDollarsMonthly"
      ),
      yearly: updateBasicsS.loadFromChild(
        "vacancyLossValue",
        "valueDollarsYearly"
      ),
    }),
    vacancyLossPercent: updateVarb(
      "numObj",
      updateBasicsS.loadFromChild("vacancyLossValue", "valuePercent")
    ),
    useCustomCosts: updateVarb("boolean", { initValue: false }),
    upfrontExpenses: updateVarbS.sumNums([
      updateFnPropS.children("upfrontExpenseGroup", "total", [
        overrideSwitchS.pathHasValue("mgmtFocal", "useCustomCosts", true),
      ]),
    ]),
    ...updateVarbsS.ongoingSumNums(
      "expenses",
      [
        ...updateFnPropsS.localBaseNameArr([
          "basePayDollars",
          "vacancyLossDollars",
        ]),
        updateFnPropS.onlyChild("ongoingExpenseGroup", "total", [
          overrideSwitchS.pathHasValue("mgmtFocal", "useCustomCosts", true),
        ]),
      ],
      "monthly"
    ),
  };
}
