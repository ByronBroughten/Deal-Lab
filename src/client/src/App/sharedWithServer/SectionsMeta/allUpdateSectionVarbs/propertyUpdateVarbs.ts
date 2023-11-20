import { relVarbInfoS } from "../SectionInfo/RelVarbInfo";
import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb, updateVarbS, uvS } from "../updateSectionVarbs/updateVarb";
import { ubS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import {
  UpdateFnProp,
  updateFnPropsS,
  upS,
} from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { updateOverride } from "../updateSectionVarbs/updateVarb/UpdateOverride";
import {
  DealModeBasics,
  uosS,
} from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import {
  osS,
  overrideSwitchS,
} from "../updateSectionVarbs/updateVarb/UpdateOverrideSwitch";
import { updateVarbsS, uvsS } from "../updateSectionVarbs/updateVarbs";
import { NumObj, numObj } from "../values/StateValue/NumObj";
import { UnionValue } from "../values/StateValue/unionValues";

type Options = { initValue?: NumObj };
function propertyModeVarb(
  dealModeToBasics: DealModeBasics,
  options: Options = {}
) {
  return uvS.dealMode(dealModeToBasics, {
    ...options,
    switchInfo: relVarbInfoS.local("propertyMode"),
  });
}

function propertyHoldingCosts(): UpdateFnProp[] {
  return [
    upS.localBaseName("taxesHolding"),
    upS.localBaseName("homeInsHolding"),
    upS.onlyChildBase("utilityHolding", "valueDollars"),
    upS.onlyChildBase("miscHoldingCost", "valueDollars"),
  ];
}

function homebuyerRentOverrides(periodicSwitch: UnionValue<"periodic">) {
  const varbNames = {
    monthly: "targetRentMonthly",
    yearly: "targetRentYearly",
  } as const;
  const varbName = varbNames[periodicSwitch];
  return [
    updateOverride([osS.localIsFalse("isRenting")], ubS.zero),
    updateOverride(
      [osS.localIsTrue("isRenting"), osS.localIsTrue("isMultifamily")],
      ubS.sumChildren("unit", varbName)
    ),
    updateOverride(
      [osS.localIsTrue("isRenting"), osS.localIsFalse("isMultifamily")],
      ubS.loadFromFirstChild("unit", varbName)
    ),
  ];
}

export function propertyUpdateVarbs(): UpdateSectionVarbs<"property"> {
  return {
    ...uvsS._typeUniformity,
    ...uvsS.savableSection,
    completionStatus: propertyCompletionStatus(),
    propertyMode: uvS.input("dealMode", { initValue: "buyAndHold" }),
    isMultifamily: uvS.input("boolean", { initValue: false }),
    isRenting: uvS.input("boolean", { initValue: false }),
    likability: propertyModeVarb(
      {
        homeBuyer: ubS.manualUpdateOnly(),
        buyAndHold: ubS.notApplicable,
        fixAndFlip: ubS.notApplicable,
        brrrr: ubS.notApplicable,
      },
      { initValue: numObj(5) }
    ),
    yearBuilt: uvS.input("numObj"),
    pricePerLikability: uvS.divide("purchasePrice", "likability"),
    streetAddress: uvS.input("string"),
    city: uvS.input("string"),
    state: uvS.input("string"),
    zipCode: uvS.input("string"),
    one: uvS.one(),

    ...uvsS.group("taxesHolding", "periodic", "yearly", {
      monthly: ubS.loadFromChild("taxesHolding", "valueDollarsMonthly"),
      yearly: ubS.loadFromChild("taxesHolding", "valueDollarsYearly"),
    }),
    ...uvsS.group("homeInsHolding", "periodic", "yearly", {
      monthly: ubS.loadFromChild("homeInsHolding", "valueDollarsMonthly"),
      yearly: ubS.loadFromChild("homeInsHolding", "valueDollarsYearly"),
    }),
    ...uvsS.group("taxesOngoing", "periodic", "yearly", {
      monthly: {
        updateOverrides: uosS.valueSource(
          "taxesAndHomeInsSource",
          {
            sameAsHoldingPhase: ubS.loadLocal("taxesHoldingMonthly"),
            valueDollarsPeriodicEditor: ubS.loadFromChild(
              "taxesOngoing",
              "valueDollarsMonthly"
            ),
          },
          {
            switchInfo: relVarbInfoS.onlyChild(
              "taxesOngoing",
              "valueSourceName"
            ),
          }
        ),
      },
      yearly: {
        updateOverrides: uosS.valueSource(
          "taxesAndHomeInsSource",
          {
            sameAsHoldingPhase: ubS.loadLocal("taxesHoldingYearly"),
            valueDollarsPeriodicEditor: ubS.loadFromChild(
              "taxesOngoing",
              "valueDollarsYearly"
            ),
          },
          {
            switchInfo: relVarbInfoS.onlyChild(
              "taxesOngoing",
              "valueSourceName"
            ),
          }
        ),
      },
    }),
    ...uvsS.group("homeInsOngoing", "periodic", "yearly", {
      monthly: {
        updateOverrides: uosS.valueSource(
          "taxesAndHomeInsSource",
          {
            sameAsHoldingPhase: ubS.loadLocal("homeInsHoldingMonthly"),
            valueDollarsPeriodicEditor: ubS.loadFromChild(
              "homeInsOngoing",
              "valueDollarsMonthly"
            ),
          },
          {
            switchInfo: relVarbInfoS.onlyChild(
              "homeInsOngoing",
              "valueSourceName"
            ),
          }
        ),
      },
      yearly: {
        updateOverrides: uosS.valueSource(
          "taxesAndHomeInsSource",
          {
            sameAsHoldingPhase: ubS.loadLocal("homeInsHoldingYearly"),
            valueDollarsPeriodicEditor: ubS.loadFromChild(
              "homeInsOngoing",
              "valueDollarsYearly"
            ),
          },
          {
            switchInfo: relVarbInfoS.onlyChild(
              "homeInsOngoing",
              "valueSourceName"
            ),
          }
        ),
      },
    }),
    ...uvsS.group("utilitiesOngoing", "periodic", "monthly", {
      monthly: ubS.loadFromChild("utilityOngoing", "valueDollarsMonthly"),
      yearly: ubS.loadFromChild("utilityOngoing", "valueDollarsYearly"),
    }),
    ...uvsS.group("utilitiesHolding", "periodic", "monthly", {
      monthly: ubS.loadFromChild("utilityHolding", "valueDollarsMonthly"),
      yearly: ubS.loadFromChild("utilityHolding", "valueDollarsYearly"),
    }),
    purchasePrice: updateVarb("numObj"),
    sqft: updateVarb("numObj"),
    afterRepairValue: propertyModeVarb({
      homeBuyer: ubS.loadLocal("purchasePrice"),
      buyAndHold: ubS.loadLocal("purchasePrice"),
      fixAndFlip: ubS.loadLocal("afterRepairValueEditor"),
      brrrr: ubS.loadLocal("afterRepairValueEditor"),
    }),
    afterRepairValueEditor: updateVarb("numObj"),
    sellingCosts: updateVarb(
      "numObj",
      ubS.loadFromChild("sellingCostValue", "valueDollars")
    ),
    numUnitsEditor: updateVarb("numObj"),
    numUnits: propertyModeVarb({
      homeBuyer: ubS.loadLocal("singleMultiNumUnits"),
      buyAndHold: ubS.sumChildren("unit", "one"),
      fixAndFlip: ubS.loadLocal("numUnitsEditor"),
      brrrr: ubS.sumChildren("unit", "one"),
    }),
    singleMultiNumUnits: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverride(
          [osS.localIsTrue("isMultifamily")],
          ubS.sumChildren("unit", "one")
        ),
        updateOverride([osS.localIsFalse("isMultifamily")], ubS.one),
      ],
    }),
    singleMultiBrCount: updateVarb("numObj", {
      updateFnName: "throwIfReached",
      updateOverrides: [
        updateOverride(
          [osS.localIsTrue("isMultifamily")],
          ubS.sumChildren("unit", "numBedrooms")
        ),
        updateOverride(
          [osS.localIsFalse("isMultifamily")],
          ubS.loadFromFirstChild("unit", "numBedrooms")
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
    ...uvsS.ongoingSumNums(
      "targetRent",
      [upS.children("unit", "targetRent")],
      "monthly"
    ),
    numBedrooms: propertyModeVarb({
      homeBuyer: ubS.loadLocal("singleMultiBrCount"),
      buyAndHold: ubS.sumChildren("unit", "numBedrooms"),
      fixAndFlip: ubS.notApplicable,
      brrrr: ubS.sumChildren("unit", "numBedrooms"),
    }),
    rehabCostBase: updateVarbS.sumNums([
      upS.children("repairValue", "valueDollars"),
      upS.children("miscOnetimeCost", "valueDollars"),
    ]),
    rehabCost: updateVarbS.sumNums([
      upS.children("repairValue", "valueDollars"),
      upS.children("miscOnetimeCost", "valueDollars"),
      upS.children("costOverrunValue", "valueDollars"),
    ]),
    ...uvsS.ongoingSumNumsNext("holdingCost", "monthly", {
      updateBasics: { updateFnName: "throwIfReached", updateFnProps: {} },
      updateOverrides: [
        {
          switches: [overrideSwitchS.local("propertyMode", "homeBuyer")],
          updateBasics: ubS.notApplicable,
        },
        {
          switches: [overrideSwitchS.local("propertyMode", "buyAndHold")],
          updateBasics: ubS.notApplicable,
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
      upS.local("holdingPeriodMonths"),
      upS.local("holdingCostMonthly")
    ),
    upfrontExpenses: propertyModeVarb({
      homeBuyer: updateVarbS.sumNums([
        upS.local("purchasePrice"),
        upS.local("rehabCost"),
      ]),
      buyAndHold: updateVarbS.sumNums([
        upS.local("purchasePrice"),
        upS.local("rehabCost"),
      ]),
      fixAndFlip: updateVarbS.sumNums([
        upS.local("purchasePrice"),
        upS.local("rehabCost"),
        upS.local("sellingCosts"),
        upS.local("holdingCostTotal"),
      ]),
      brrrr: updateVarbS.sumNums([
        upS.local("purchasePrice"),
        upS.local("rehabCost"),
        upS.local("holdingCostTotal"),
      ]),
    }),
    ...uvsS.ongoingSumNums(
      "expensesOngoing",
      [
        upS.localBaseName("taxesOngoing"),
        upS.localBaseName("homeInsOngoing"),
        upS.localBaseName("miscOngoingCosts"),
        upS.onlyChild("utilityOngoing", "valueDollars"),
        upS.onlyChild("maintenanceOngoing", "valueDollars"),
        upS.onlyChild("capExValueOngoing", "valueDollars"),
      ],
      "monthly"
    ),
    miscOnetimeCosts: updateVarb(
      "numObj",
      ubS.loadFromChild("miscOnetimeCost", "valueDollars")
    ),

    ...uvsS.group("miscOngoingCosts", "periodic", "monthly", {
      monthly: ubS.loadFromChild("miscOngoingCost", "valueDollarsMonthly"),
      yearly: ubS.loadFromChild("miscOngoingCost", "valueDollarsYearly"),
    }),
    ...uvsS.group("miscOngoingRevenue", "periodic", "monthly", {
      monthly: ubS.loadFromChild("miscOngoingRevenue", "valueDollarsMonthly"),
      yearly: ubS.loadFromChild("miscOngoingRevenue", "valueDollarsYearly"),
    }),
    ...uvsS.monthsYearsInput("holdingPeriod", "months"),
    ...uvsS.ongoingSumNums(
      "revenueOngoing",
      updateFnPropsS.localBaseNameArr(["targetRent", "miscOngoingRevenue"]),
      "monthly"
    ),
  };
}

function propertyCompletionStatus() {
  return uvS.completionStatusO(
    ...uosS.dealMode(
      {
        homeBuyer: ubS.completionStatus({
          nonNone: hasOngoingNoneNones(),
          validInputs: [
            ...propertySharedValidInputs(),
            ...hasOngoingValidInputs(),
          ],
        }),
        buyAndHold: ubS.completionStatus({
          nonZeros: [upS.local("numUnits")],
          nonNone: hasOngoingNoneNones(),
          validInputs: [
            ...propertySharedValidInputs(),
            ...hasOngoingValidInputs(),
          ],
        }),
        fixAndFlip: ubS.completionStatus({
          nonNone: [upS.onlyChild("repairValue", "valueSourceName")],
          validInputs: [
            ...propertySharedValidInputs(),
            ...hasHoldingValidInputs(),
            upS.local("numUnitsEditor"),
          ],
        }),
        brrrr: ubS.completionStatus({
          nonZeros: [upS.local("numUnits")],
          nonNone: [
            upS.onlyChild("repairValue", "valueSourceName"),
            ...hasOngoingNoneNones(),
          ],
          validInputs: [
            ...propertySharedValidInputs(),
            ...hasOngoingValidInputs(),
            ...hasHoldingValidInputs(),
          ],
        }),
      },
      { switchInfo: relVarbInfoS.local("propertyMode") }
    )
  );
}

function hasOngoingNoneNones(): UpdateFnProp[] {
  return [
    upS.onlyChild("repairValue", "valueSourceName"),
    upS.onlyChild("utilityOngoing", "valueSourceName"),
    upS.onlyChild("maintenanceOngoing", "valueSourceName"),
    upS.onlyChild("capExValueOngoing", "valueSourceName"),
  ];
}
function hasOngoingValidInputs(): UpdateFnProp[] {
  return [
    upS.onlyChild("taxesOngoing", "valueDollarsPeriodicEditor"),
    upS.onlyChild("homeInsOngoing", "valueDollarsPeriodicEditor"),
    upS.onlyChild("capExValueOngoing", "valueDollarsPeriodicEditor", [
      osS.valueSourceIs("valueDollarsPeriodicEditor"),
    ]),
    upS.onlyChild("maintenanceOngoing", "valueDollarsPeriodicEditor", [
      osS.valueSourceIs("valueDollarsPeriodicEditor"),
    ]),
  ];
}

function propertySharedValidInputs(): UpdateFnProp[] {
  return [
    ...upS.localArr("purchasePrice", "sqft"),
    upS.onlyChild("repairValue", "valueDollarsEditor", [
      osS.valueSourceIs("valueDollarsEditor"),
    ]),
    upS.onlyChild("costOverrunValue", "valueDollarsEditor", [
      osS.valueSourceIs("valueDollarsEditor"),
    ]),
    upS.onlyChild("costOverrunValue", "valuePercentEditor", [
      osS.valueSourceIs("valuePercentEditor"),
    ]),
  ];
}

function hasHoldingValidInputs(): UpdateFnProp[] {
  return [
    upS.onlyChild("taxesHolding", "valueDollarsPeriodicEditor"),
    upS.onlyChild("homeInsHolding", "valueDollarsPeriodicEditor"),
    upS.local("holdingPeriodSpanEditor"),
  ];
}
