import { Arr } from "../../../utils/Arr";
import { ValidationError } from "../../../utils/Error";
import { Obj } from "../../../utils/Obj";
import { dealModes, getDealModes, isDealMode } from "./dealMode";
import { financingModes } from "./financingMode";

const valueSources = {
  periodic: ["monthly", "yearly"],
  timespan: ["months", "years"],
  days: ["days"],

  dealDisplayNameSource: ["displayNameEditor", "defaultDisplayName"],
  percentDollarsSource: [
    "offPercentEditor",
    "offDollarsEditor",
    "amountPercentEditor",
    "amountDollarsEditor",
  ],
  taxesAndHomeInsSource: ["valueDollarsEditor", "sameAsHoldingPhase"],
  ongoingPhaseSource: ["sameAsHoldingPhase", "valueDollarsEditor"],
  utilityValueSource: [
    "none",
    "zero",
    "listTotal",
    "valueDollarsEditor",
    "threeHundredPerUnit",
    "sameAsHoldingPhase",
  ],
  maintainanceValueSource: [
    "none",
    "onePercentArv",
    "onePercentArvAndSqft",
    "sqft",
    "valueDollarsEditor",
  ],
  capExValueSource: [
    "none",
    "fivePercentRent",
    "valueDollarsEditor",
    "listTotal",
  ],
  arvValueSource: ["purchasePrice", "valueDollarsEditor"],
  loanBaseValueSource: [
    "purchaseLoanValue",
    "repairLoanValue",
    "arvLoanValue",
    "customAmountEditor",
    "priceAndRepairValues",
  ],
  mgmtBasePayValueSource: [
    "none",
    "zero",
    "tenPercentRent",
    "percentOfRentEditor",
    "valueDollarsPeriodicEditor",
  ],
  mortgageInsUpfrontSource: ["valueDollarsEditor", "percentLoanEditor"],
  mortgageInsPeriodic: ["dollarsEditor", "percentEditor"],
  vacancyLossValueSource: [
    "none",
    "fivePercentRent",
    "tenPercentRent",
    "percentOfRentEditor",
    "valueDollarsPeriodicEditor",
  ],
  editorValueSource: ["valueEditor"],
  valueDollarsEditor: ["valueDollarsEditor"],

  customValueSource: ["none", "valueEditor", "listTotal"],
  repairValueSource: ["none", "zero", "valueDollarsEditor", "listTotal"],
  overrunValueSource: ["valueDollarsEditor", "valuePercentEditor"],
  dollarsOrList: ["valueDollarsEditor", "listTotal"],
  dollarsListOrZero: ["zero", "valueDollarsEditor", "listTotal"],
  dollarsOrListOngoing: ["valueDollarsEditor", "listTotal"],
  spanOrDollars: ["valueSpanEditor", "valueDollarsEditor"],
  // monthsOrDollars: ["valueMonthsEditor", "valueDollarsEditor"],
  // daysOrDollars: ["valueSpanEditor", "valueDollarsEditor"],
  sellingCostSource: [
    "sixPercent",
    "valuePercentEditor",
    "valueDollarsEditor",
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
  compareDealStatus: ["comparing", "editing"],
  appSaveStatus: ["unsaved", "saving", "saved", "saveFailed"],
  dealSort: ["dateCreated", "dateUpdated"],
  authStatus: ["guest", "user"],
  labSubscription: ["basicPlan", "fullPlan"],
  autoSyncControl: ["autoSyncOff", "autoSyncOn"],
  completionStatus: ["allEmpty", "allValid", "someInvalid"],
  dealMode: dealModes,
  dealModePlusMixed: getDealModes("plusMixed"),
  dealModePlusEmpty: getDealModes("plusEmpty"),
  financingMode: financingModes,
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
  "periodic",
  "timespan",
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
  if (!isDealMode("hasHolding")) {
    return "Financing";
  } else {
    return financingModeLabels[financingMode];
  }
}

const periodicMode = ["holding", "ongoing"] as const;
export type PeriodicMode = (typeof periodicMode)[number];

export const defaultCreateDealModeOf = "homeBuyer";
