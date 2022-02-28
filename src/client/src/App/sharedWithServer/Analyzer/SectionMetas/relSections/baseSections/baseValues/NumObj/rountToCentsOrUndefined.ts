import { round } from "lodash";

export const numberOrUndefined = (maybeNum: any): number | undefined => {
  if (typeof maybeNum === "number") {
    if (["NaN"].includes(String(maybeNum))) return undefined;
    else return maybeNum; // "infinity" is allowed;
  } else return undefined;
};

export const roundToCentsOrUndefined = (value: any) => {
  const numOrUn = numberOrUndefined(value);
  if (typeof numOrUn === "number") return round(numOrUn, 2);
  else return undefined;
};
