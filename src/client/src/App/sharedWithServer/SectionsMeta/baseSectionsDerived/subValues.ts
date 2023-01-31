export type SyncStatus = "unsyncedChanges" | "changesSynced";
export type AutoSyncControl = "autoSyncOff" | "autoSyncOn";
export type CompletionStatus = "allEmpty" | "allValid" | "someInvalid";

export type RepairValueMode = "none" | "turnkey" | "lumpSum" | "itemize";
export type UtilityValueMode = "none" | "tenantUtilities" | "itemize";
export type MaintenanceValueMode =
  | "none"
  | "onePercentPrice"
  | "sqft"
  | "onePercentAndSqft"
  | "lumpSum";
export type CapExValueMode = "none" | "fivePercentRent" | "lumpSum" | "itemize";

export type CustomValueMode = "none" | "lumpSum" | "itemize";
