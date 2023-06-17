import { Arr } from "../../../utils/Arr";
import { ValidationError } from "../../../utils/Error";
import { Obj } from "../../../utils/Obj";
import { dealModes, getDealModes } from "./dealMode";

const valueSources = {
  ongoingSwitch: ["monthly", "yearly"],
  monthsYearsSwitch: ["months", "years"],

  dealDisplayNameSource: ["displayNameEditor", "defaultDisplayName"],
  percentDollarsSource: [
    "offPercentEditor",
    "offDollarsEditor",
    "amountPercentEditor",
    "amountDollarsEditor",
  ],
  ongoingPhaseSource: ["sameAsHoldingPhase", "valueDollarsPeriodicEditor"],
  loanBaseValueSource: [
    "purchaseLoanValue",
    "repairLoanValue",
    "arvLoanValue",
    "customAmountEditor",
    "priceAndRepairValues",
  ],
  downPaymentValueSource: [
    "none",
    "percentOfAssetEditor",
    "dollarsEditor",
    "fifteenPercentAsset",
  ],
  mgmtBasePayValueSource: [
    "none",
    "zero",
    "tenPercentRent",
    "percentOfRentEditor",
    "dollarsEditor",
  ],
  vacancyLossValueSource: [
    "none",
    "fivePercentRent",
    "tenPercentRent",
    "percentOfRentEditor",
    "dollarsEditor",
  ],
  editorValueSource: ["valueEditor"],
  loadedVarbSource: ["loadedVarb"],
  customValueSource: ["none", "valueEditor", "listTotal"],
  utilityValueSource: [
    "none",
    "zero",
    "listTotal",
    "twentyPercentRent",
    "sameAsHoldingPhase",
  ],
  repairValueSource: ["none", "zero", "valueDollarsEditor", "listTotal"],
  overrunValueSource: ["valueDollarsEditor", "valuePercentEditor"],
  dollarsOrList: ["valueDollarsEditor", "listTotal"],
  dollarsListOrZero: ["zero", "valueDollarsEditor", "listTotal"],
  dollarsOrListOngoing: ["valueDollarsPeriodicEditor", "listTotal"],
  sellingCostSource: [
    "sixPercent",
    "valuePercentEditor",
    "valueDollarsEditor",
    "itemize",
  ],
  maintainanceValueSource: [
    "none",
    "onePercentPrice",
    "sqft",
    "onePercentAndSqft",
    "valueDollarsPeriodicEditor",
  ],
  capExValueSource: [
    "none",
    "fivePercentRent",
    "valueDollarsPeriodicEditor",
    "listTotal",
  ],
  closingCostValueSource: [
    "none",
    "fivePercentLoan",
    "valueDollarsEditor",
    "listTotal",
  ],
} as const;

type ValueSources = typeof valueSources;
export type ValueSourceType = keyof ValueSources;
export type ValueSource<VT extends ValueSourceType = ValueSourceType> =
  ValueSources[VT][number];

const unionValueArrs = {
  ...valueSources,
  appSaveStatus: ["unsaved", "saving", "saved", "saveFailed"],
  dealSort: ["dateCreated", "dateUpdated"],
  authStatus: ["guest", "user"],
  labSubscription: ["basicPlan", "fullPlan"],
  autoSyncControl: ["autoSyncOff", "autoSyncOn"],
  completionStatus: ["allEmpty", "allValid", "someInvalid"],
  dealMode: dealModes,
  dealModePlusMixed: getDealModes("plusMixed"),
  financingMode: ["purchase", "refinance"],
  financingMethod: ["cashOnly", "useLoan", ""],
  userDataStatus: [
    "notLoaded",
    "loading",
    "loaded",
    // unloading
  ],
} as const;

type UnionValueArrs = typeof unionValueArrs;
export type UnionValueName = keyof UnionValueArrs;
export const unionValueNames = Obj.keys(unionValueArrs);
export function unionValueArr<UN extends UnionValueName>(
  valueName: UN
): UnionValueArrs[UN] {
  return unionValueArrs[valueName];
}
export type UnionValue<UN extends UnionValueName> = UnionValueArrs[UN][number];
export type UnionValueNamesToTypes = {
  [UN in UnionValueName]: UnionValue<UN>;
};

export function validateLabSubscription(
  value: any
): UnionValue<"labSubscription"> {
  if (isLabSubscription(value)) return value;
  else throw new ValidationError(`value "${value}" is not a labSubscription`);
}
export function isLabSubscription(
  value: any
): value is UnionValue<"labSubscription"> {
  const subscriptions = unionValueArr("labSubscription");
  return subscriptions.includes(value);
}

export const switchValueNames = Arr.extractStrict(unionValueNames, [
  "ongoingSwitch",
  "monthsYearsSwitch",
] as const);

export const dealModeLabels: Record<UnionValue<"dealMode">, string> = {
  homeBuyer: "Homebuyer",
  buyAndHold: "Rental Property",
  fixAndFlip: "Fix & Flip",
  brrrr: "BRRRR",
};

const financingModeLabels: Record<UnionValue<"financingMode">, string> = {
  purchase: "Purchase Financing",
  refinance: "Refinance",
};

export function getFinancingTitle(
  dealMode: UnionValue<"dealMode">,
  financingMode: UnionValue<"financingMode">
): string {
  if (dealMode !== "brrrr") {
    return "Financing";
  } else {
    return financingModeLabels[financingMode];
  }
}
