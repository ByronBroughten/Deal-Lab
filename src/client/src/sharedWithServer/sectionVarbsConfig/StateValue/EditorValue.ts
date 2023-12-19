import { Arr } from "../../utils/Arr";
import { StateValue } from "../StateValue";
import { valueNames } from "../ValueName";

const editorValueNames = Arr.extract(valueNames, [
  "string",
  "numObj",
  "stringArray",
  "stringObj",
] as const);

export type EditorValueName = (typeof editorValueNames)[number];
export function isEditorValueName(value: any): value is EditorValueName {
  return editorValueNames.includes(value);
}

export type EditorValue = StateValue<EditorValueName>;

export type StrAdornments = {
  startAdornment: string;
  endAdornment: string;
};
