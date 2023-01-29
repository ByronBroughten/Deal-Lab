import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { relVarbS, updateVarb } from "../updateSectionVarbs/updateVarb";
import {
  updateFnPropS,
  updateFnPropsS,
} from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";
import { overrideSwitchS } from "./../updateSectionVarbs/updateVarb/UpdateOverrides";

export function propertyUpdateVarbs(): UpdateSectionVarbs<"property"> {
  return {
    ...updateVarbsS._typeUniformity,
    ...updateVarbsS.savableSection,

    price: updateVarb("numObj"),
    sqft: updateVarb("numObj"),
    ...updateVarbsS.ongoingInputNext("taxes", {
      switchInit: "yearly",
    }),

    arv: updateVarb("numObj"),
    sellingCosts: updateVarb("numObj"),

    numUnits: relVarbS.sumChildNums("unit", "one"),
    numBedrooms: relVarbS.sumChildNums("unit", "numBedrooms"),
    upfrontExpenses: relVarbS.sumNums([
      updateFnPropS.local("price"),
      updateFnPropS.children("repairValue", "value"),
      updateFnPropS.onlyChild("upfrontExpenseGroup", "total", [
        overrideSwitchS.pathHasValue("propertyFocal", "useCustomCosts", true),
      ]),
    ]),
    upfrontRevenue: relVarbS.sumNums([
      updateFnPropS.children("upfrontRevenueGroup", "total"),
    ]),
    useCustomCosts: updateVarb("boolean", { initValue: false }),
    ...updateVarbsS.ongoingSumNums(
      "expenses",
      [
        updateFnPropS.local("taxes"),
        updateFnPropS.local("homeIns"),
        updateFnPropS.onlyChild("utilityValue", "value"),
        updateFnPropS.onlyChild("maintenanceValue", "value"),
        updateFnPropS.onlyChild("capExValue", "value"),
        updateFnPropS.onlyChild("ongoingExpenseGroup", "total", [
          overrideSwitchS.pathHasValue("propertyFocal", "useCustomCosts", true),
        ]),
      ],
      "monthly"
    ),
    ...updateVarbsS.ongoingInputNext("homeIns", {
      switchInit: "yearly",
    }),
    ...updateVarbsS.monthsYearsInput("holdingPeriod", "months"),
    ...updateVarbsS.ongoingSumNums(
      "miscRevenue",
      [updateFnPropS.children("ongoingRevenueGroup", "total")],
      "monthly"
    ),
    ...updateVarbsS.ongoingSumNums(
      "targetRent",
      [updateFnPropS.children("unit", "targetRent")],
      "monthly"
    ),
    ...updateVarbsS.ongoingSumNums(
      "revenue",
      updateFnPropsS.localArr(["targetRent", "miscRevenue"]),
      "monthly"
    ),
  };
}
