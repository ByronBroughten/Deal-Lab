import { relVarbInfoS } from "../SectionInfo/RelVarbInfo";
import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb, updateVarbS } from "../updateSectionVarbs/updateVarb";
import { updateBasicsS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import {
  updateFnPropS,
  updateFnPropsS,
} from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";
import {
  overrideSwitchS,
  unionSwitchOverride,
} from "./../updateSectionVarbs/updateVarb/UpdateOverrides";

export function propertyUpdateVarbs(): UpdateSectionVarbs<"property"> {
  return {
    ...updateVarbsS._typeUniformity,
    ...updateVarbsS.savableSection,
    propertyMode: updateVarb("dealMode", {
      initValue: "buyAndHold",
    }),
    address: updateVarb("string"),
    one: updateVarbS.one(),
    purchasePrice: updateVarb("numObj"),
    sqft: updateVarb("numObj"),
    ...updateVarbsS.ongoingInputNext("taxes", {
      switchInit: "yearly",
    }),
    afterRepairValue: updateVarb("numObj"),
    sellingCosts: updateVarb(
      "numObj",
      updateBasicsS.loadFromChild("sellingCostValue", "valueDollars")
    ),
    numUnits: updateVarbS.sumChildNums("unit", "one"),
    numBedrooms: updateVarbS.sumChildNums("unit", "numBedrooms"),
    useCustomCosts: updateVarb("boolean", { initValue: false }),
    useCustomOngoingCosts: updateVarb("boolean", { initValue: false }),
    useCustomOneTimeCosts: updateVarb("boolean", { initValue: false }),
    rehabCost: updateVarbS.sumNums([
      updateFnPropS.children("repairValue", "value"),
      updateFnPropS.children("costOverrunValue", "valueDollars"),
    ]),
    ...updateVarbsS.ongoingSumNumsNext("holdingCost", "monthly", {
      updateFnProps: [
        updateFnPropS.localBaseName("taxes"),
        updateFnPropS.localBaseName("homeIns"),
        updateFnPropS.onlyChildBase("utilityValue", "value"),
        updateFnPropS.onlyChild("ongoingExpenseGroup", "total", [
          overrideSwitchS.pathHasValue(
            "propertyFocal",
            "useCustomOngoingCosts",
            true
          ),
        ]),
      ],
    }),
    holdingCostTotal: updateVarbS.leftRightPropFn("simpleMultiply", [
      updateFnPropS.local("holdingPeriodMonths"),
      updateFnPropS.local("holdingCostMonthly"),
    ]),
    upfrontExpenses: updateVarb("numObj", {
      updateOverrides: unionSwitchOverride(
        "dealMode",
        relVarbInfoS.local("propertyMode"),
        {
          buyAndHold: updateVarbS.sumNums([
            updateFnPropS.local("purchasePrice"),
            updateFnPropS.local("rehabCost"),
            updateFnPropS.onlyChild("upfrontExpenseGroup", "total", [
              overrideSwitchS.pathHasValue(
                "propertyFocal",
                "useCustomCosts",
                true
              ),
            ]),
          ]),
          fixAndFlip: updateVarbS.sumNums([
            updateFnPropS.local("purchasePrice"),
            updateFnPropS.local("rehabCost"),
            updateFnPropS.local("sellingCosts"),
            updateFnPropS.local("holdingCostTotal"),
          ]),
        }
      ),
    }),
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
