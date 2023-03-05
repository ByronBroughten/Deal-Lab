import { Obj } from "../../../utils/Obj";

const unionValueArrs = {
  authStatus: ["guest", "user"],
  syncStatus: ["unsyncedChanges", "changesSynced"],
  autoSyncControl: ["autoSyncOff", "autoSyncOn"],
  completionStatus: ["allEmpty", "allValid", "someInvalid"],
  editorValueSource: ["valueEditor"],
  loadedVarbSource: ["loadedVarb"],
  customValueSource: ["none", "valueEditor", "listTotal"],
  utilityValueSource: ["none", "zero", "listTotal"],
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
  dealMode: ["buyAndHold", "fixAndFlip", "brrrrr"],
  financingMode: ["cashOnly", "useLoan", ""],
  userDataStatus: [
    "notLoaded",
    "loading",
    "loaded",
    // unloading
  ],
  labSubscription: ["basicPlan", "fullPlan"],
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
