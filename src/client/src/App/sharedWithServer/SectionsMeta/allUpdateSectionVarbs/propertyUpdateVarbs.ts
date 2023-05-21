import { relVarbInfoS } from "../SectionInfo/RelVarbInfo";
import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb, updateVarbS } from "../updateSectionVarbs/updateVarb";
import { updateBasicsS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import {
  UpdateFnProp,
  updateFnPropS,
  updateFnPropsS,
} from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { overrideSwitchS } from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import { unionSwitchOverride } from "../updateSectionVarbs/updateVarb/updateVarbUtils";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";
import { propertyCompletionStatus } from "./calculatedUpdateVarbs/completionStatusVarbs";

const basicsS = updateBasicsS;
const propS = updateFnPropS;
const varbsS = updateVarbsS;

function propertyHoldingCosts(): UpdateFnProp[] {
  return [
    propS.localBaseName("taxesHolding"),
    propS.localBaseName("homeInsHolding"),
    propS.onlyChildBase("utilityHolding", "valueDollars"),
    propS.onlyChildBase("miscHoldingCost", "valueDollars"),
  ];
}

export function propertyUpdateVarbs(): UpdateSectionVarbs<"property"> {
  return {
    ...varbsS._typeUniformity,
    ...varbsS.savableSection,
    propertyMode: updateVarb("dealMode", {
      initValue: "buyAndHold",
    }),
    completionStatus: propertyCompletionStatus,
    streetAddress: updateVarb("string"),
    city: updateVarb("string"),
    state: updateVarb("string"),
    zipCode: updateVarb("string"),
    one: updateVarbS.one(),

    ...varbsS.ongoingInput("taxesHolding"),
    ...varbsS.ongoingInput("homeInsHolding"),
    ...varbsS.group("taxesOngoing", "ongoing", "yearly", {
      monthly: basicsS.loadFromChild("taxesOngoing", "valueDollarsMonthly"),
      yearly: basicsS.loadFromChild("taxesOngoing", "valueDollarsYearly"),
    }),
    ...varbsS.group("homeInsOngoing", "ongoing", "monthly", {
      monthly: basicsS.loadFromChild("homeInsOngoing", "valueDollarsMonthly"),
      yearly: basicsS.loadFromChild("homeInsOngoing", "valueDollarsYearly"),
    }),
    ...varbsS.group("utilitiesOngoing", "ongoing", "monthly", {
      monthly: basicsS.loadFromChild("utilityOngoing", "valueDollarsMonthly"),
      yearly: basicsS.loadFromChild("utilityOngoing", "valueDollarsYearly"),
    }),
    ...varbsS.group("utilitiesHolding", "ongoing", "monthly", {
      monthly: basicsS.loadFromChild("utilityHolding", "valueDollarsMonthly"),
      yearly: basicsS.loadFromChild("utilityHolding", "valueDollarsYearly"),
    }),
    purchasePrice: updateVarb("numObj"),
    sqft: updateVarb("numObj"),
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
          brrrr: basicsS.sumChildren("unit", "one"),
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
          brrrr: basicsS.sumChildren("unit", "numBedrooms"),
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
    ...varbsS.ongoingSumNumsNext("holdingCost", "monthly", {
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
          updateFnProps: propertyHoldingCosts(),
        },
        {
          switches: [overrideSwitchS.local("propertyMode", "brrrr")],
          updateFnProps: propertyHoldingCosts(),
        },
      ],
    }),
    holdingCostTotal: updateVarbS.equationLR(
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
          brrrr: updateVarbS.sumNums([
            propS.local("purchasePrice"),
            propS.local("rehabCost"),
            propS.local("sellingCosts"),
            propS.local("holdingCostTotal"),
          ]),
        }
      ),
    }),
    ...varbsS.ongoingSumNums(
      "expenses",
      [
        propS.localBaseName("taxesOngoing"),
        propS.localBaseName("homeInsOngoing"),
        propS.localBaseName("miscCosts"),
        propS.onlyChild("utilityOngoing", "valueDollars"),
        propS.onlyChild("maintenanceValue", "valueDollars"),
        propS.onlyChild("capExValue", "valueDollars"),
      ],
      "monthly"
    ),
    miscOnetimeCosts: updateVarb(
      "numObj",
      basicsS.loadFromChild("miscOnetimeCost", "valueDollars")
    ),

    ...varbsS.group("miscCosts", "ongoing", "monthly", {
      monthly: basicsS.loadFromChild("miscOngoingCost", "valueDollarsMonthly"),
      yearly: basicsS.loadFromChild("miscOngoingCost", "valueDollarsYearly"),
    }),
    ...varbsS.group("miscRevenue", "ongoing", "monthly", {
      monthly: basicsS.loadFromChild("miscRevenueValue", "valueDollarsMonthly"),
      yearly: basicsS.loadFromChild("miscRevenueValue", "valueDollarsYearly"),
    }),
    ...varbsS.monthsYearsInput("holdingPeriod", "months"),
    ...varbsS.ongoingSumNums(
      "targetRent",
      [propS.children("unit", "targetRent")],
      "monthly"
    ),
    ...varbsS.ongoingSumNums(
      "revenue",
      updateFnPropsS.localBaseNameArr(["targetRent", "miscRevenue"]),
      "monthly"
    ),
  };
}
