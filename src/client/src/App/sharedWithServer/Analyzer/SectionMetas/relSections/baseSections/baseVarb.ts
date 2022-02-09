import { merge } from "lodash";
import { Obj } from "../../../../utils/Obj";

const baseValueTypes = [
  "number",
  "boolean",
  "string",
  "stringArray",
  "numObj",
] as const;

export type BaseValueType = typeof baseValueTypes[number];
type GeneralBaseVarb = {
  valueType: BaseValueType;
  selectable: boolean;
};
const baseVarb = {
  schema<B extends GeneralBaseVarb>(generalBaseVarb: B): B {
    return generalBaseVarb;
  },
};
