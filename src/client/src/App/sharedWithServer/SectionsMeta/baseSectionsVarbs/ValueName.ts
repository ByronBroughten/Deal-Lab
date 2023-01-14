export const valueNames = [
  "number",
  "dateTime",
  "boolean",
  "string",
  "stringArray",
  "stringObj",
  "numObj",
  "inEntityInfo",
] as const;
export type ValueName = typeof valueNames[number];
