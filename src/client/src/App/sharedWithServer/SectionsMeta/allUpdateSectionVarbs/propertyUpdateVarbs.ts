import { relVarbInfoS } from "../SectionInfo/RelVarbInfo";
import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb, updateVarbS } from "../updateSectionVarbs/updateVarb";
import { updateBasicsS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import {
  updateFnPropS,
  updateFnPropsS,
} from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { overrideSwitchS } from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import { unionSwitchOverride } from "../updateSectionVarbs/updateVarb/updateVarbUtils";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";
import { propertyCompletionStatus } from "./calculatedUpdateVarbs/completionStatusVarbs";

const basicsS = updateBasicsS;
const propS = updateFnPropS;

export function propertyUpdateVarbs(): UpdateSectionVarbs<"property"> {
  return {
    ...updateVarbsS._typeUniformity,
    ...updateVarbsS.savableSection,
    propertyMode: updateVarb("dealMode", {
      initValue: "buyAndHold",
    }),
    completionStatus: propertyCompletionStatus,
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
          homeBuyer: basicsS.one,
          buyAndHold: basicsS.sumChildren("unit", "one"),
          fixAndFlip: basicsS.loadFromLocal("numUnitsEditor"),
        }
      ),
    }),
    numBedroomsEditor: updateVarb("numObj"),
    numBedrooms: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: unionSwitchOverride(
        "dealMode",
        relVarbInfoS.local("propertyMode"),
        {
          homeBuyer: basicsS.loadFromLocal("numBedroomsEditor"),
          buyAndHold: basicsS.sumChildren("unit", "numBedrooms"),
          fixAndFlip: basicsS.notApplicable,
        }
      ),
    }),
    rehabCostBase: updateVarbS.sumNums([
      propS.children("repairValue", "valueDollars"),
      propS.children("miscOnetimeCost", "valueDollars"),
    ]),
    rehabCost: updateVarbS.sumNums([
      propS.children("repairValue", "valueDollars"),
      propS.children("miscOnetimeCost", "valueDollars"),
      propS.children("costOverrunValue", "valueDollars"),
    ]),
    ...updateVarbsS.ongoingSumNumsNext("holdingCost", "monthly", {
      updateBasics: { updateFnName: "throwIfReached", updateFnProps: {} },
      updateOverrides: [
        {
          switches: [overrideSwitchS.local("propertyMode", "homeBuyer")],
          updateBasics: basicsS.notApplicable,
        },
        {
          switches: [overrideSwitchS.local("propertyMode", "buyAndHold")],
          updateBasics: basicsS.notApplicable,
        },
        {
          switches: [overrideSwitchS.local("propertyMode", "fixAndFlip")],
          updateFnProps: [
            propS.localBaseName("taxes"),
            propS.localBaseName("homeIns"),
            propS.onlyChildBase("utilityValue", "valueDollars"),
            propS.onlyChildBase("miscHoldingCost", "valueDollars"),
          ],
        },
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
          homeBuyer: updateVarbS.sumNums([
            propS.local("purchasePrice"),
            propS.local("rehabCost"),
          ]),
          buyAndHold: updateVarbS.sumNums([
            propS.local("purchasePrice"),
            propS.local("rehabCost"),
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
        propS.localBaseName("miscCosts"),
        propS.onlyChild("utilityValue", "valueDollars"),
        propS.onlyChild("maintenanceValue", "valueDollars"),
        propS.onlyChild("capExValue", "valueDollars"),
      ],
      "monthly"
    ),
    ...updateVarbsS.ongoingInputNext("homeIns", {
      switchInit: "yearly",
    }),

    miscOnetimeCosts: updateVarb(
      "numObj",
      basicsS.loadFromChild("miscOnetimeCost", "valueDollars")
    ),

    ...updateVarbsS.group("miscCosts", "ongoing", "monthly", {
      monthly: basicsS.loadFromChild("miscOngoingCost", "valueDollarsMonthly"),
      yearly: basicsS.loadFromChild("miscOngoingCost", "valueDollarsYearly"),
    }),
    ...updateVarbsS.group("miscRevenue", "ongoing", "monthly", {
      monthly: basicsS.loadFromChild("miscRevenueValue", "valueDollarsMonthly"),
      yearly: basicsS.loadFromChild("miscRevenueValue", "valueDollarsYearly"),
    }),
    ...updateVarbsS.monthsYearsInput("holdingPeriod", "months"),
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
