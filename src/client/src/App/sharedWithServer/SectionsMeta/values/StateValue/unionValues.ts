import { Obj } from "../../../utils/Obj";

export type SyncStatus = "unsyncedChanges" | "changesSynced";
export type AutoSyncControl = "autoSyncOff" | "autoSyncOn";

const unionValueArrs = {
  completionStatus: ["allEmpty", "allValid", "someInvalid"],
  editorValueSource: ["valueEditor"],
  customValueSource: ["none", "valueEditor", "listTotal"],
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

export type RepairValueMode = "none" | "zero" | "valueEditor" | "listTotal";
export type UtilityValueMode = "none" | "zero" | "listTotal";
export type MaintenanceValueMode =
  | "none"
  | "onePercentPrice"
  | "sqft"
  | "onePercentAndSqft"
  | "valueEditor";
export type CapExValueMode =
  | "none"
  | "fivePercentRent"
  | "valueEditor"
  | "listTotal";
export type ClosingCostValueMode =
  | "none"
  | "fivePercentLoan"
  | "valueEditor"
  | "listTotal";

export const dealModes = ["buyAndHold", "fixAndFlip", "brrrrr"] as const;
export type DealMode = typeof dealModes[number];

export type FinancingMode = "cashOnly" | "useLoan" | "";

export const userDataStatuses = [
  "notLoaded",
  "loading",
  "loaded",
  // unloading
] as const;
export type UserDataStatus = typeof userDataStatuses[number];

export const userPlans = ["basicPlan", "fullPlan"] as const;
export type AnalyzerPlan = typeof userPlans[number];
export function isUserPlan(value: any): value is AnalyzerPlan {
  return userPlans.includes(value);
}
