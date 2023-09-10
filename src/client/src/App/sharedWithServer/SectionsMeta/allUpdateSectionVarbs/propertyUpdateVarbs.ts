import { relVarbInfoS } from "../SectionInfo/RelVarbInfo";
import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb, updateVarbS } from "../updateSectionVarbs/updateVarb";
import { updateBasicsS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import {
  UpdateFnProp,
  updateFnPropS,
  updateFnPropsS,
} from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import {
  overrideSwitchS,
  updateOverride,
} from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import {
  dealModeVarb,
  unionOverrides,
  valueSourceOverrides,
} from "../updateSectionVarbs/updateVarb/updateVarbUtils";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";
import { numObj } from "../values/StateValue/NumObj";
import { UnionValue } from "../values/StateValue/unionValues";
import { propertyCompletionStatus } from "./calculatedUpdateVarbs/completionStatusVarbs";

const basicsS = updateBasicsS;
const propS = updateFnPropS;
const varbsS = updateVarbsS;
const oSwitchS = overrideSwitchS;

function propertyHoldingCosts(): UpdateFnProp[] {
  return [
    propS.localBaseName("taxesHolding"),
    propS.localBaseName("homeInsHolding"),
    propS.onlyChildBase("utilityHolding", "valueDollars"),
    propS.onlyChildBase("miscHoldingCost", "valueDollars"),
  ];
}

const varb = updateVarb;

function homebuyerRentOverrides(periodicSwitch: UnionValue<"periodicSource">) {
  const varbNames = {
    monthly: "targetRentMonthly",
    yearly: "targetRentYearly",
  } as const;
  const varbName = varbNames[periodicSwitch];
  return [
    updateOverride([oSwitchS.localIsFalse("isRenting")], basicsS.zero),
    updateOverride(
      [
        oSwitchS.localIsTrue("isRenting"),
        oSwitchS.localIsTrue("isMultifamily"),
      ],
      basicsS.sumChildren("unit", varbName)
    ),
    updateOverride(
      [
        oSwitchS.localIsTrue("isRenting"),
        oSwitchS.localIsFalse("isMultifamily"),
      ],
      basicsS.loadFromFirstChild("unit", varbName)
    ),
  ];
}
// Should homeBuyer mode have ROI and whatnot then?
// At the very least, it needs something that shows expenses minus
// rent.

// Should expensesMinusRent be on property?
// Well, it could be. It could also be on deal.

export function propertyUpdateVarbs(): UpdateSectionVarbs<"property"> {
  return {
    ...varbsS._typeUniformity,
    ...varbsS.savableSection,
    propertyMode: varb("dealMode", {
      initValue: "buyAndHold",
    }),
    isMultifamily: varb("boolean", { initValue: false }),
    isRenting: varb("boolean", { initValue: false }),
    likability: varb("numObj", { initValue: numObj(5) }),
    yearBuilt: varb("numObj"),
    pricePerLikability: varb(
      "numObj",
      basicsS.equationLR(
        "divide",
        propS.local("purchasePrice"),
        propS.local("likability")
      )
    ),
    completionStatus: propertyCompletionStatus,
    streetAddress: varb("string"),
    city: varb("string"),
    state: varb("string"),
    zipCode: varb("string"),
    one: updateVarbS.one(),

    ...varbsS.group("taxesHolding", "periodic", "yearly", {
      monthly: basicsS.loadFromChild("taxesHolding", "valueDollarsMonthly"),
      yearly: basicsS.loadFromChild("taxesHolding", "valueDollarsYearly"),
    }),
    ...varbsS.group("homeInsHolding", "periodic", "yearly", {
      monthly: basicsS.loadFromChild("homeInsHolding", "valueDollarsMonthly"),
      yearly: basicsS.loadFromChild("homeInsHolding", "valueDollarsYearly"),
    }),
    ...varbsS.group("taxesOngoing", "periodic", "yearly", {
      monthly: {
        updateOverrides: valueSourceOverrides(
          "taxesAndHomeInsSource",
          {
            sameAsHoldingPhase: basicsS.loadFromLocal("taxesHoldingMonthly"),
            valueDollarsPeriodicEditor: basicsS.loadFromChild(
              "taxesOngoing",
              "valueDollarsMonthly"
            ),
          },
          relVarbInfoS.onlyChild("taxesOngoing", "valueSourceName")
        ),
      },
      yearly: {
        updateOverrides: valueSourceOverrides(
          "taxesAndHomeInsSource",
          {
            sameAsHoldingPhase: basicsS.loadFromLocal("taxesHoldingYearly"),
            valueDollarsPeriodicEditor: basicsS.loadFromChild(
              "taxesOngoing",
              "valueDollarsYearly"
            ),
          },
          relVarbInfoS.onlyChild("taxesOngoing", "valueSourceName")
        ),
      },
    }),
    ...varbsS.group("homeInsOngoing", "periodic", "yearly", {
      monthly: {
        updateOverrides: valueSourceOverrides(
          "taxesAndHomeInsSource",
          {
            sameAsHoldingPhase: basicsS.loadFromLocal("homeInsHoldingMonthly"),
            valueDollarsPeriodicEditor: basicsS.loadFromChild(
              "homeInsOngoing",
              "valueDollarsMonthly"
            ),
          },
          relVarbInfoS.onlyChild("homeInsOngoing", "valueSourceName")
        ),
      },
      yearly: {
        updateOverrides: valueSourceOverrides(
          "taxesAndHomeInsSource",
          {
            sameAsHoldingPhase: basicsS.loadFromLocal("homeInsHoldingYearly"),
            valueDollarsPeriodicEditor: basicsS.loadFromChild(
              "homeInsOngoing",
              "valueDollarsYearly"
            ),
          },
          relVarbInfoS.onlyChild("homeInsOngoing", "valueSourceName")
        ),
      },
    }),
    ...varbsS.group("utilitiesOngoing", "periodic", "monthly", {
      monthly: basicsS.loadFromChild("utilityOngoing", "valueDollarsMonthly"),
      yearly: basicsS.loadFromChild("utilityOngoing", "valueDollarsYearly"),
    }),
    ...varbsS.group("utilitiesHolding", "periodic", "monthly", {
      monthly: basicsS.loadFromChild("utilityHolding", "valueDollarsMonthly"),
      yearly: basicsS.loadFromChild("utilityHolding", "valueDollarsYearly"),
    }),
    purchasePrice: updateVarb("numObj"),
    sqft: updateVarb("numObj"),
    afterRepairValue: dealModeVarb(
      {
        homeBuyer: basicsS.loadFromLocal("purchasePrice"),
        buyAndHold: basicsS.loadFromLocal("purchasePrice"),
        fixAndFlip: basicsS.loadFromLocal("afterRepairValueEditor"),
        brrrr: basicsS.loadFromLocal("afterRepairValueEditor"),
      },
      relVarbInfoS.local("propertyMode")
    ),
    afterRepairValueEditor: updateVarb("numObj"),
    sellingCosts: updateVarb(
      "numObj",
      basicsS.loadFromChild("sellingCostValue", "valueDollars")
    ),
    numUnitsEditor: updateVarb("numObj"),
    numUnits: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: unionOverrides(
        "dealMode",
        relVarbInfoS.local("propertyMode"),
        {
          homeBuyer: basicsS.loadFromLocal("singleMultiNumUnits"),
          buyAndHold: basicsS.sumChildren("unit", "one"),
          fixAndFlip: basicsS.loadFromLocal("numUnitsEditor"),
          brrrr: basicsS.sumChildren("unit", "one"),
        }
      ),
    }),
    singleMultiNumUnits: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverride(
          [oSwitchS.localIsTrue("isMultifamily")],
          basicsS.sumChildren("unit", "one")
        ),
        updateOverride([oSwitchS.localIsFalse("isMultifamily")], basicsS.one),
      ],
    }),
    singleMultiBrCount: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverride(
          [oSwitchS.localIsTrue("isMultifamily")],
          basicsS.sumChildren("unit", "numBedrooms")
        ),
        updateOverride(
          [oSwitchS.localIsFalse("isMultifamily")],
          basicsS.loadFromFirstChild("unit", "numBedrooms")
        ),
      ],
    }),
    ...updateVarbsS.group("homebuyerRent", "periodic", "monthly", {
      monthly: {
        updateFnName: "throwIfReached",
        updateOverrides: homebuyerRentOverrides("monthly"),
      },
      yearly: {
        updateFnName: "throwIfReached",
        updateOverrides: homebuyerRentOverrides("yearly"),
      },
    }),
    // Ok, it's a good thing I'm redoing this
    ...varbsS.ongoingSumNums(
      "targetRent",
      [propS.children("unit", "targetRent")],
      "monthly"
    ),
    numBedrooms: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: unionOverrides(
        "dealMode",
        relVarbInfoS.local("propertyMode"),
        {
          homeBuyer: basicsS.loadFromLocal("singleMultiBrCount"),
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
      updateOverrides: unionOverrides(
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
            propS.local("holdingCostTotal"),
          ]),
        }
      ),
    }),
    ...varbsS.ongoingSumNums(
      "expensesOngoing",
      [
        propS.localBaseName("taxesOngoing"),
        propS.localBaseName("homeInsOngoing"),
        propS.localBaseName("miscOngoingCosts"),
        propS.onlyChild("utilityOngoing", "valueDollars"),
        propS.onlyChild("maintenanceOngoing", "valueDollars"),
        propS.onlyChild("capExValueOngoing", "valueDollars"),
      ],
      "monthly"
    ),
    miscOnetimeCosts: updateVarb(
      "numObj",
      basicsS.loadFromChild("miscOnetimeCost", "valueDollars")
    ),

    ...varbsS.group("miscOngoingCosts", "periodic", "monthly", {
      monthly: basicsS.loadFromChild("miscOngoingCost", "valueDollarsMonthly"),
      yearly: basicsS.loadFromChild("miscOngoingCost", "valueDollarsYearly"),
    }),
    ...varbsS.group("miscOngoingRevenue", "periodic", "monthly", {
      monthly: basicsS.loadFromChild(
        "miscOngoingRevenue",
        "valueDollarsMonthly"
      ),
      yearly: basicsS.loadFromChild("miscOngoingRevenue", "valueDollarsYearly"),
    }),
    ...varbsS.monthsYearsInput("holdingPeriod", "months"),
    ...varbsS.ongoingSumNums(
      "revenueOngoing",
      updateFnPropsS.localBaseNameArr(["targetRent", "miscOngoingRevenue"]),
      "monthly"
    ),
  };
}
