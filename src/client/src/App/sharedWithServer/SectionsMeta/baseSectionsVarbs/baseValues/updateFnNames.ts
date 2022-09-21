import { calculationNames } from "./calculations";

// calculations
const calcNumObjFnNames = ["calcVarbs", ...calculationNames] as const;
export type CalcNumObjFnName = typeof calcNumObjFnNames[number];
export function isCalcNumObjFnName(value: string): value is CalcNumObjFnName {
  return calcNumObjFnNames.includes(value as any);
}

// user input
const NumObjUserInputFnNames = ["calcVarbs"] as const;
export type NumObjUserInputFnName = typeof NumObjUserInputFnNames[number];
export function isNumObjUserInputFnName(
  value: string
): value is NumObjUserInputFnName {
  return NumObjUserInputFnNames.includes(value as any);
}
export const numObjUpdateFnNames = [
  ...calcNumObjFnNames,
  "userVarb",
  "virtualNumObj",
  "loadEditorSolvableText",
  "loadNumObj",
] as const;
export type NumObjUpdateFnName = typeof numObjUpdateFnNames[number];
export function isNumObjUpdateFnName(value: any): value is NumObjUpdateFnName {
  return numObjUpdateFnNames.includes(value);
}
