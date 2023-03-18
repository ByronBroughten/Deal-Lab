import { Obj } from "../../../utils/Obj";

const valueSources = {
  loanPurpose: ["purchasePrice", "upfrontRepairs", "purchasePriceAndRepairs"],
  loanAmountInputMode: ["downPayment", "loanAmount"],
  loanBaseValueSource: [
    "none",
    "percentOfAssetEditor",
    "dollarsEditor",
    "eightyFivePercentAsset",
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
  utilityValueSource: ["none", "zero", "listTotal", "twentyPercentRent"],
  repairValueSource: ["none", "zero", "valueEditor", "listTotal"],
  maintainanceValueSource: [
    "none",
    "onePercentPrice",
    "sqft",
    "onePercentAndSqft",
    "valueEditor",
  ],
  capExValueSource: ["none", "fivePercentRent", "valueEditor", "listTotal"],
  closingCostValueSource: [
    "none",
    "fivePercentLoan",
    "valueEditor",
    "listTotal",
  ],
} as const;

type ValueSources = typeof valueSources;
export type ValueSource = ValueSources[keyof ValueSources][number];

const unionValueArrs = {
  ...valueSources,
  authStatus: ["guest", "user"],
  labSubscription: ["basicPlan", "fullPlan"],
  syncStatus: ["unsyncedChanges", "changesSynced"],
  autoSyncControl: ["autoSyncOff", "autoSyncOn"],
  completionStatus: ["allEmpty", "allValid", "someInvalid"],
  dealMode: ["buyAndHold", "fixAndFlip", "brrrr"],
  financingMode: ["cashOnly", "useLoan", ""],
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

export function isLabSubscription(
  value: any
): value is UnionValue<"labSubscription"> {
  const subscriptions = unionValueArr("labSubscription");
  return subscriptions.includes(value);
}

export const dealModeLabels: Record<UnionValue<"dealMode">, string> = {
  buyAndHold: "Buy & Hold",
  fixAndFlip: "Fix & Flip",
  brrrr: "BRRRR",
};
