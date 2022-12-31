import { valueMetas } from "../baseSectionsDerived/valueMetas";
import { ValueNamesToTypes } from "../baseSectionsDerived/valueMetaTypes";
import { StateValue } from "./baseValues/StateValueTypes";

export type Adornments = {
  startAdornment: string;
  endAdornment: string;
};

export type ValueTypesPlusAny = ValueNamesToTypes & { any: StateValue };
export const valueSchemasPlusAny = {
  ...valueMetas,
  any: { is: () => true },
} as const;

export type StateValueAnyKey = keyof ValueTypesPlusAny;
