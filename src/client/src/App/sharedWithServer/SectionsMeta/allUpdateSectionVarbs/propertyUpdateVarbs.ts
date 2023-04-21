import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb, updateVarbS } from "../updateSectionVarbs/updateVarb";
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
    address: updateVarb("string"),
    one: updateVarbS.one(),
    purchasePrice: updateVarb("numObj"),
    sqft: updateVarb("numObj"),
    ...updateVarbsS.ongoingInputNext("taxes", {
      switchInit: "yearly",
    }),
    afterRepairValue: updateVarb("numObj"),
    sellingCosts: updateVarb("numObj"),
    numUnits: updateVarbS.sumChildNums("unit", "one"),
    numBedrooms: updateVarbS.sumChildNums("unit", "numBedrooms"),
    useCustomCosts: updateVarb("boolean", { initValue: false }),
    upfrontExpenses: updateVarbS.sumNums([
      updateFnPropS.local("purchasePrice"),
      updateFnPropS.children("repairValue", "value"),
      updateFnPropS.onlyChild("upfrontExpenseGroup", "total", [
        overrideSwitchS.pathHasValue("propertyFocal", "useCustomCosts", true),
      ]),
    ]),
    ...updateVarbsS.ongoingSumNums(
      "expenses",
      [
        updateFnPropS.localBaseName("taxes"),
        updateFnPropS.localBaseName("homeIns"),
        updateFnPropS.onlyChild("utilityValue", "value"),
        updateFnPropS.onlyChild("maintenanceValue", "value"),
        updateFnPropS.onlyChild("capExValue", "value"),
        updateFnPropS.onlyChild("ongoingExpenseGroup", "total", [
          overrideSwitchS.pathHasValue("propertyFocal", "useCustomCosts", true),
        ]),
      ],
      "monthly"
    ),
    upfrontRevenue: updateVarbS.sumNums([
      updateFnPropS.children("upfrontRevenueGroup", "total"),
    ]),
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
      updateFnPropsS.localBaseNameArr(["targetRent", "miscRevenue"]),
      "monthly"
    ),
  };
}
