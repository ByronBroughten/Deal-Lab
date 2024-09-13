import { unionValueNames } from "./schema4ValueTraits/StateValue/unionValues";

export const valueNames = [
  "number",
  "dateTime",
  "boolean",
  "string",
  "stringArray",
  "stringObj",
  "numObj",
  "inEntityValue",
  "changesToSave",
  "changesSaving",
  ...unionValueNames,
] as const;
export type ValueName = (typeof valueNames)[number];
