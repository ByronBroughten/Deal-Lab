import { Obj } from "../../../utils/Obj";
import { valueMeta } from "../../baseSectionsDerived/valueMeta";
import { ValueNamesToTypes } from "../../baseSectionsDerived/valueMetaTypes";

const editorUpdateNames = [
  "calcVarbs",
  "string",
  "stringArray",
  "stringObj",
  "manualUpdateOnly",
] as const;
type EditorUpdateName = typeof editorUpdateNames[number];
export function isEditorUpdateFnName(value: string): value is EditorUpdateName {
  return editorUpdateNames.includes(value as any);
}

export type StateValue = ValueNamesToTypes[keyof ValueNamesToTypes];

// basic values don't have to change form before going into the database
const basicValueNames = ["number", "boolean", "string", "stringArray"] as const;
type BasicValues = {
  [Property in typeof basicValueNames[number]]: ValueNamesToTypes[Property];
};
export type BasicValue = BasicValues[keyof BasicValues];
export function isBasicValue(value: any): value is BasicValue {
  return basicValueNames.includes(value as any);
}

export function isStateValue(value: any): value is StateValue {
  for (const valueType of Obj.keys(valueMeta)) {
    if (valueMeta[valueType].is(value)) return true;
  }
  return false;
}
