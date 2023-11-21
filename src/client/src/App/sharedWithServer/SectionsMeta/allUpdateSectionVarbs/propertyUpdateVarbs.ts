import { GroupKey } from "../groupedNames";
import { relVarbInfoS } from "../SectionInfo/RelVarbInfo";
import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb, uvS } from "../updateSectionVarbs/updateVarb";
import {
  OverrideBasics,
  uosB,
} from "../updateSectionVarbs/updateVarb/OverrideBasics";
import { ubS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import {
  UpdateFnProp,
  upS,
} from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { updateOverride } from "../updateSectionVarbs/updateVarb/UpdateOverride";
import {
  DealModeBasics,
  uosS,
} from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import { osS } from "../updateSectionVarbs/updateVarb/UpdateOverrideSwitch";
import {
  GroupUpdateVarbs,
  updateVarbsS,
  uvsS,
} from "../updateSectionVarbs/updateVarbs";
import { NumObj, numObj } from "../values/StateValue/NumObj";
import { UnionValue } from "../values/StateValue/unionValues";
import { periodicEnding } from "./../groupedNames";

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
function propertyModeOverrides(dealModeToBasics: DealModeBasics) {
  return uosS.dealMode(dealModeToBasics, {
    switchInfo: relVarbInfoS.local("propertyMode"),
  });
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
    ...uvsS.loadChildPeriodic("taxesHolding", "taxesHolding", "valueDollars"),
    ...uvsS.loadChildPeriodic(
      "homeInsHolding",
      "homeInsHolding",
      "valueDollars"
    ),
    ...ongoingVarbs("taxes"),
    ...ongoingVarbs("homeIns"),
    ...uvsS.loadChildPeriodic(
      "utilitiesOngoing",
      "utilityOngoing",
      "valueDollars"
    ),
    ...uvsS.loadChildPeriodic(
      "utilitiesHolding",
      "utilityHolding",
      "valueDollars"
    ),
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
      ubS.loadChild("sellingCostValue", "valueDollars")
    ),
    numUnitsEditor: updateVarb("numObj"),
    numUnits: propertyModeVarb({
      homeBuyer: ubS.loadLocal("singleMultiNumUnits"),
      buyAndHold: ubS.sumChildren("unit", "one"),
      fixAndFlip: ubS.loadLocal("numUnitsEditor"),
      brrrr: ubS.sumChildren("unit", "one"),
    }),
    singleMultiNumUnits: uvS.numObjO([
      updateOverride(
        [osS.localIsTrue("isMultifamily")],
        ubS.sumChildren("unit", "one")
      ),
      updateOverride([osS.localIsFalse("isMultifamily")], ubS.one),
    ]),
    singleMultiBrCount: uvS.numObjO([
      updateOverride(
        [osS.localIsTrue("isMultifamily")],
        ubS.sumChildren("unit", "numBedrooms")
      ),
      updateOverride(
        [osS.localIsFalse("isMultifamily")],
        ubS.loadFromFirstChild("unit", "numBedrooms")
      ),
    ]),
    ...updateVarbsS.periodic2("homebuyerRent", {
      monthly: uosB(homebuyerRentOverrides("monthly")),
      yearly: uosB(homebuyerRentOverrides("yearly")),
    }),
    ...uvsS.periodic2("targetRent", {
      monthly: ubS.sumChildren("unit", "targetRentMonthly"),
      yearly: ubS.sumChildren("unit", "targetRentYearly"),
    }),
    numBedrooms: propertyModeVarb({
      homeBuyer: ubS.loadLocal("singleMultiBrCount"),
      buyAndHold: ubS.sumChildren("unit", "numBedrooms"),
      fixAndFlip: ubS.notApplicable,
      brrrr: ubS.sumChildren("unit", "numBedrooms"),
    }),
    rehabCostBase: uvS.sumNums([
      upS.children("repairValue", "valueDollars"),
      upS.children("miscOnetimeCost", "valueDollars"),
    ]),
    rehabCost: uvS.sumNums([
      upS.children("repairValue", "valueDollars"),
      upS.children("miscOnetimeCost", "valueDollars"),
      upS.children("costOverrunValue", "valueDollars"),
    ]),
    ...uvsS.periodic2("holdingCost", {
      monthly: holdingCostPeriodic("monthly"),
      yearly: holdingCostPeriodic("yearly"),
    }),

    holdingCostTotal: uvS.multiply("holdingPeriodMonths", "holdingCostMonthly"),
    upfrontExpenses: propertyModeVarb({
      homeBuyer: ubS.sumNums("purchasePrice", "rehabCost"),
      buyAndHold: ubS.sumNums("purchasePrice", "rehabCost"),
      fixAndFlip: ubS.sumNums(
        "purchasePrice",
        "rehabCost",
        "sellingCosts",
        "holdingCostTotal"
      ),
      brrrr: ubS.sumNums("purchasePrice", "rehabCost", "holdingCostTotal"),
    }),
    ...uvsS.periodicSumNums("revenueOngoing", {
      localBaseNames: ["targetRent", "miscOngoingRevenue"],
    }),
    ...uvsS.periodicSumNums("expensesOngoing", {
      localBaseNames: ["taxesOngoing", "homeInsOngoing", "miscOngoingCosts"],
      childBaseNames: [
        ["utilityOngoing", "valueDollars"],
        ["maintenanceOngoing", "valueDollars"],
        ["capExValueOngoing", "valueDollars"],
      ],
    }),

    miscOnetimeCosts: uvS.loadNumObjChild("miscOnetimeCost", "valueDollars"),
    ...uvsS.loadChildPeriodic(
      "miscOngoingRevenue",
      "miscOngoingRevenue",
      "valueDollars"
    ),
    ...uvsS.loadChildPeriodic(
      "miscOngoingCosts",
      "miscOngoingCost",
      "valueDollars"
    ),
    ...uvsS.monthsYearsInput("holdingPeriod", "months"),
  };
}

function holdingCostPeriodic(groupKey: GroupKey<"periodic">): OverrideBasics {
  return uosB(
    propertyModeOverrides({
      homeBuyer: ubS.notApplicable,
      buyAndHold: ubS.notApplicable,
      fixAndFlip: ubS.sumNums(...propertyHoldingCosts(groupKey)),
      brrrr: ubS.sumNums(...propertyHoldingCosts(groupKey)),
    })
  );
}

function propertyHoldingCosts(groupKey: GroupKey<"periodic">): UpdateFnProp[] {
  const ending = periodicEnding(groupKey);
  return [
    upS.local(`taxesHolding${ending}`),
    upS.local(`homeInsHolding${ending}`),
    upS.onlyChild("utilityHolding", `valueDollars${ending}`),
    upS.onlyChild("miscHoldingCost", `valueDollars${ending}`),
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

type OngoingBaseName<BN extends "taxes" | "homeIns"> = `${BN}Ongoing`;
function ongoingVarbs<BN extends "taxes" | "homeIns">(
  base: BN
): GroupUpdateVarbs<OngoingBaseName<BN>, "periodic"> {
  const baseName = `${base}Ongoing`;
  return uvsS.periodic2(baseName, {
    monthly: uosB(
      uosS.valueSource(
        "taxesAndHomeInsSource",
        {
          sameAsHoldingPhase: ubS.loadLocal(`${base}HoldingMonthly`),
          valueDollarsPeriodicEditor: ubS.loadChild(
            `${base}Ongoing`,
            "valueDollarsMonthly"
          ),
        },
        {
          switchInfo: relVarbInfoS.onlyChild(
            `${base}Ongoing`,
            "valueSourceName"
          ),
        }
      )
    ),
    yearly: uosB(
      uosS.valueSource(
        "taxesAndHomeInsSource",
        {
          sameAsHoldingPhase: ubS.loadLocal(`${base}HoldingYearly`),
          valueDollarsPeriodicEditor: ubS.loadChild(
            `${base}Ongoing`,
            "valueDollarsYearly"
          ),
        },
        {
          switchInfo: relVarbInfoS.onlyChild(
            `${base}Ongoing`,
            "valueSourceName"
          ),
        }
      )
    ),
  });
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
