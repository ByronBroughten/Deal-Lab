import { Obj } from "../../../utils/Obj";
import { ValueTypes } from "../../relSectionsUtils/rel/valueMetaTypes";
import { valueMeta } from "../../relSectionsUtils/valueMeta";

const editorUpdateNames = [
  "calcVarbs",
  "string",
  "stringArray",
  "stringObj",
  "updateByEditorOnly",
] as const;
type EditorUpdateName = typeof editorUpdateNames[number];
export function isEditorUpdateFnName(value: string): value is EditorUpdateName {
  return editorUpdateNames.includes(value as any);
}

export type StateValue = ValueTypes[keyof ValueTypes];

// basic values don't have to change form before going into the database
const basicValueNames = ["number", "boolean", "string", "stringArray"] as const;
type BasicValues = {
  [Property in typeof basicValueNames[number]]: ValueTypes[Property];
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
