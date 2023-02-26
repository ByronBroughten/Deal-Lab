export type SyncStatus = "unsyncedChanges" | "changesSynced";
export type AutoSyncControl = "autoSyncOff" | "autoSyncOn";

export const completionStatuses = [
  "allEmpty",
  "allValid",
  "someInvalid",
] as const;
export type CompletionStatus = typeof completionStatuses[number];

export type RepairValueMode = "none" | "turnkey" | "lumpSum" | "itemize";
export type UtilityValueMode = "none" | "tenantUtilities" | "itemize";
export type MaintenanceValueMode =
  | "none"
  | "onePercentPrice"
  | "sqft"
  | "onePercentAndSqft"
  | "lumpSum";
export type CapExValueMode = "none" | "fivePercentRent" | "lumpSum" | "itemize";
export type ClosingCostValueMode =
  | "none"
  | "fivePercentLoan"
  | "lumpSum"
  | "itemize";

export type CustomValueMode = "none" | "lumpSum" | "itemize";

export type ValueSource = "labeledEquation" | "valueSource";

export const dealModes = ["buyAndHold", "fixAndFlip", "brrrrr"] as const;
export type DealMode = typeof dealModes[number];
