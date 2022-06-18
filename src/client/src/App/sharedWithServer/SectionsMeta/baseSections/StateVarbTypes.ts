import { ValueTypes } from "../relSections/rel/valueMetaTypes";
import { valueMeta } from "./baseValues";
import { StateValue } from "./baseValues/StateValueTypes";

export type Adornments = {
  startAdornment: string;
  endAdornment: string;
};

export type ValueTypesPlusAny = ValueTypes & { any: StateValue };
export const valueSchemasPlusAny = {
  ...valueMeta,
  any: { is: () => true },
} as const;

export type StateValueAnyKey = keyof ValueTypesPlusAny;
