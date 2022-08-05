import { StateValue } from "./baseValues/StateValueTypes";
import { valueMeta } from "./valueMeta";
import { ValueNamesToTypes } from "./valueMetaTypes";

export type Adornments = {
  startAdornment: string;
  endAdornment: string;
};

export type ValueTypesPlusAny = ValueNamesToTypes & { any: StateValue };
export const valueSchemasPlusAny = {
  ...valueMeta,
  any: { is: () => true },
} as const;

export type StateValueAnyKey = keyof ValueTypesPlusAny;
