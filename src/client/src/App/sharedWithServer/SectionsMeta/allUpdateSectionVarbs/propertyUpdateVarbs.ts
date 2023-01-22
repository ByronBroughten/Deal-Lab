import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { relVarbS, updateVarb } from "../updateSectionVarbs/updateVarb";
import {
  updateFnPropS,
  updateFnPropsS,
} from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";

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
      updateFnPropS.children("repairCostValue", "value"),
      updateFnPropS.children("upfrontExpenseGroup", "total"),
    ]),
    upfrontRevenue: relVarbS.sumNums([
      updateFnPropS.children("upfrontRevenueGroup", "total"),
    ]),

    ...updateVarbsS.ongoingSumNums(
      "expenses",
      [
        updateFnPropS.local("taxes"),
        updateFnPropS.local("homeIns"),
        updateFnPropS.onlyChild("capExCostValue", "value"),
        updateFnPropS.onlyChild("maintenanceCostValue", "value"),
        updateFnPropS.children("utilityCostValue", "value"),
        updateFnPropS.children("ongoingExpenseGroup", "total"),
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
