import { roundToCents } from "../../../../utils/math";

export const numberOrUndefined = (maybeNum: any): number | undefined => {
  if (typeof maybeNum === "number") {
    if (["NaN"].includes(String(maybeNum))) return undefined;
    else return maybeNum; // "infinity" is allowed;
  } else return undefined;
};

export const roundToCentsOrUndefined = (value: any) => {
  const numOrUn = numberOrUndefined(value);
  if (typeof numOrUn === "number") return roundToCents(numOrUn);
  else return undefined;
};
