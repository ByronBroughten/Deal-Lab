export const valueNames = [
  "number",
  "dateTime",
  "boolean",
  "string",
  "stringArray",
  "stringObj",
  "numObj",
  "inEntityValue",
  "varbInfo",
] as const;
export type ValueName = typeof valueNames[number];
