export const valueNames = [
  "number",
  "dateTime",
  "boolean",
  "string",
  "stringArray",
  "stringObj",
  "numObj",
  "inEntityInfo",
  "varbInfo",
] as const;
export type ValueName = typeof valueNames[number];
