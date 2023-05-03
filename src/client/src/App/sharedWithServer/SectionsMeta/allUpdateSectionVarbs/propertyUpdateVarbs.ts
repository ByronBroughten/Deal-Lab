import { relVarbInfoS } from "../SectionInfo/RelVarbInfo";
import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb, updateVarbS } from "../updateSectionVarbs/updateVarb";
import { updateBasicsS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import {
  updateFnPropS,
  updateFnPropsS,
} from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { unionSwitchOverride } from "../updateSectionVarbs/updateVarb/updateVarbUtils";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";
import {
  overrideSwitchS,
  updateOverride,
} from "./../updateSectionVarbs/updateVarb/UpdateOverrides";

const basicsS = updateBasicsS;
const switchS = overrideSwitchS;
const propS = updateFnPropS;

export function propertyUpdateVarbs(): UpdateSectionVarbs<"property"> {
  return {
    ...updateVarbsS._typeUniformity,
    ...updateVarbsS.savableSection,
    propertyMode: updateVarb("dealMode", {
      initValue: "buyAndHold",
    }),
    streetAddress: updateVarb("string"),
    city: updateVarb("string"),
    state: updateVarb("string"),
    zipCode: updateVarb("string"),
    one: updateVarbS.one(),
    purchasePrice: updateVarb("numObj"),
    sqft: updateVarb("numObj"),
    ...updateVarbsS.ongoingInputNext("taxes", {
      switchInit: "yearly",
    }),
    afterRepairValue: updateVarb("numObj"),
    sellingCosts: updateVarb(
      "numObj",
      basicsS.loadFromChild("sellingCostValue", "valueDollars")
    ),
    numUnitsEditor: updateVarb("numObj"),
    numUnits: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: unionSwitchOverride(
        "dealMode",
        relVarbInfoS.local("propertyMode"),
        {
          buyAndHold: basicsS.sumChildren("unit", "one"),
          fixAndFlip: basicsS.loadFromLocal("numUnitsEditor"),
        }
      ),
    }),
    numBedrooms: updateVarbS.sumChildNums("unit", "numBedrooms"),
    useCustomCosts: updateVarb("boolean", { initValue: false }),
    useCustomOngoingCosts: updateVarb("boolean", { initValue: false }),
    useCustomOneTimeCosts: updateVarb("boolean", { initValue: false }),
    rehabCost: updateVarbS.sumNums([
      propS.children("repairValue", "value"),
      propS.children("costOverrunValue", "valueDollars"),
    ]),
    ...updateVarbsS.ongoingSumNumsNext("holdingCost", "monthly", {
      updateFnProps: [
        propS.localBaseName("taxes"),
        propS.localBaseName("homeIns"),
        propS.onlyChildBase("utilityValue", "value"),
        propS.children("customOngoingExpense", "value", [
          switchS.pathHasValue("propertyFocal", "useCustomCosts", true),
        ]),
      ],
    }),
    holdingCostTotal: updateVarbS.leftRightPropFn(
      "multiply",
      propS.local("holdingPeriodMonths"),
      propS.local("holdingCostMonthly")
    ),
    upfrontExpenses: updateVarb("numObj", {
      updateOverrides: unionSwitchOverride(
        "dealMode",
        relVarbInfoS.local("propertyMode"),
        {
          buyAndHold: updateVarbS.sumNums([
            propS.local("purchasePrice"),
            propS.local("rehabCost"),
            propS.local("customUpfrontCosts"),
          ]),
          fixAndFlip: updateVarbS.sumNums([
            propS.local("purchasePrice"),
            propS.local("rehabCost"),
            propS.local("sellingCosts"),
            propS.local("holdingCostTotal"),
          ]),
        }
      ),
    }),
    ...updateVarbsS.ongoingSumNums(
      "expenses",
      [
        propS.localBaseName("taxes"),
        propS.localBaseName("homeIns"),
        propS.onlyChild("utilityValue", "value"),
        propS.onlyChild("maintenanceValue", "value"),
        propS.onlyChild("capExValue", "value"),
        propS.onlyChild("customOngoingExpense", "value", [
          switchS.pathHasValue("propertyFocal", "useCustomCosts", true),
        ]),
      ],
      "monthly"
    ),
    customUpfrontCosts: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverride(
          [switchS.localIsTrue("useCustomCosts")],
          basicsS.sumChildren("customUpfrontExpense", "value")
        ),
        updateOverride([switchS.localIsFalse("useCustomCosts")], basicsS.zero),
      ],
    }),
    ...updateVarbsS.ongoingSumNumsNext("customCosts", "monthly", {
      updateFnProps: [propS.children("customOngoingExpense", "value")],
    }),
    ...updateVarbsS.ongoingInputNext("homeIns", {
      switchInit: "yearly",
    }),
    ...updateVarbsS.monthsYearsInput("holdingPeriod", "months"),
    ...updateVarbsS.ongoingSumNums(
      "miscRevenue",
      [propS.children("ongoingRevenueGroup", "total")],
      "monthly"
      //
    ),
    ...updateVarbsS.ongoingSumNums(
      "targetRent",
      [propS.children("unit", "targetRent")],
      "monthly"
    ),
    ...updateVarbsS.ongoingSumNums(
      "revenue",
      updateFnPropsS.localBaseNameArr(["targetRent", "miscRevenue"]),
      "monthly"
    ),
  };
}
