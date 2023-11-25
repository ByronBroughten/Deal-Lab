import { GroupKey, periodicEnding } from "../GroupName";
import { relVarbInfoS } from "../SectionInfo/RelVarbInfo";
import { USVS, usvs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb, uvS } from "../updateSectionVarbs/updateVarb";
import {
  OverrideBasics,
  uosb,
  uosbS,
} from "../updateSectionVarbs/updateVarb/OverrideBasics";
import { ubS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import {
  UpdateFnProp,
  upS,
} from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import {
  DealModeBasics,
  uosS,
} from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import { osS } from "../updateSectionVarbs/updateVarb/UpdateOverrideSwitch";
import { GroupUpdateVarbs, uvsS } from "../updateSectionVarbs/updateVarbs";
import { NumObj, numObj } from "../values/StateValue/NumObj";

export function propertyUpdateVarbs(): USVS<"property"> {
  return usvs("property", {
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
    singleMultiNumUnits: uvS.numObjO(
      uosS.boolean("isMultifamily", {
        true: ubS.sumChildren("unit", "one"),
        false: ubS.one,
      })
    ),
    singleMultiBrCount: uvS.numObjO(
      uosS.boolean("isMultifamily", {
        true: ubS.sumChildren("unit", "numBedrooms"),
        false: ubS.loadFromFirstChild("unit", "numBedrooms"),
      })
    ),
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
    ...uvsS.loadChildTimespan("holdingPeriod", "holdingPeriod", "value"),
  });
}

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

function holdingCostPeriodic(groupKey: GroupKey<"periodic">): OverrideBasics {
  return uosb(
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

type OngoingBaseName<BN extends "taxes" | "homeIns"> = `${BN}Ongoing`;
function ongoingVarbs<BN extends "taxes" | "homeIns">(
  base: BN
): GroupUpdateVarbs<OngoingBaseName<BN>, "periodic"> {
  const baseName = `${base}Ongoing`;
  return uvsS.periodic2(baseName, {
    monthly: uosbS.valueSource(
      "taxesAndHomeInsSource",
      {
        sameAsHoldingPhase: ubS.loadLocal(`${base}HoldingMonthly`),
        valueDollarsEditor: ubS.loadChild(
          `${base}Ongoing`,
          "valueDollarsMonthly"
        ),
      },
      {
        switchInfo: relVarbInfoS.onlyChild(`${base}Ongoing`, "valueSourceName"),
      }
    ),
    yearly: uosbS.valueSource(
      "taxesAndHomeInsSource",
      {
        sameAsHoldingPhase: ubS.loadLocal(`${base}HoldingYearly`),
        valueDollarsEditor: ubS.loadChild(
          `${base}Ongoing`,
          "valueDollarsYearly"
        ),
      },
      {
        switchInfo: relVarbInfoS.onlyChild(`${base}Ongoing`, "valueSourceName"),
      }
    ),
  });
}

function propertyCompletionStatus() {
  return uvS.completionStatusO(
    ...uosS.dealMode(
      {
        homeBuyer: ubS.completionStatus({
          nonNone: hasOngoingNoneNones(),
          notEmptySolvable: hasOngoingNotEmpty(),
          validInputs: propertySharedValidInputs(),
        }),
        buyAndHold: ubS.completionStatus({
          nonZeros: [upS.local("numUnits")],
          nonNone: hasOngoingNoneNones(),
          notEmptySolvable: hasOngoingNotEmpty(),
          validInputs: propertySharedValidInputs(),
        }),
        fixAndFlip: ubS.completionStatus({
          nonNone: [upS.onlyChild("repairValue", "valueSourceName")],
          notEmptySolvable: hasHoldingNotEmpty(),
          validInputs: [
            ...propertySharedValidInputs(),
            upS.local("numUnitsEditor"),
          ],
        }),
        brrrr: ubS.completionStatus({
          nonZeros: [upS.local("numUnits")],
          nonNone: [
            upS.onlyChild("repairValue", "valueSourceName"),
            ...hasOngoingNoneNones(),
          ],
          notEmptySolvable: [...hasOngoingNotEmpty(), ...hasHoldingNotEmpty()],
          validInputs: propertySharedValidInputs(),
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

function hasOngoingNotEmpty(): UpdateFnProp[] {
  return [
    upS.onlyChild("taxesOngoing", "valueDollarsMonthly"),
    upS.onlyChild("taxesOngoing", "valueDollarsYearly"),

    upS.onlyChild("homeInsOngoing", "valueDollarsMonthly"),
    upS.onlyChild("homeInsOngoing", "valueDollarsYearly"),

    upS.onlyChild("capExValueOngoing", "valueDollarsMonthly"),
    upS.onlyChild("capExValueOngoing", "valueDollarsYearly"),

    upS.onlyChild("maintenanceOngoing", "valueDollarsMonthly"),
    upS.onlyChild("maintenanceOngoing", "valueDollarsYearly"),
  ];
}

function hasHoldingNotEmpty(): UpdateFnProp[] {
  return [
    upS.onlyChild("taxesHolding", "valueDollarsMonthly"),
    upS.onlyChild("taxesHolding", "valueDollarsYearly"),

    upS.onlyChild("homeInsHolding", "valueDollarsMonthly"),
    upS.onlyChild("homeInsHolding", "valueDollarsYearly"),

    upS.onlyChild("holdingPeriod", "valueMonths"),
    upS.onlyChild("holdingPeriod", "valueYears"),
  ];
}
