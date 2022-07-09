import { ValueTypes } from "../relSectionsUtils/rel/valueMetaTypes";
import { StateValue } from "./baseValues/StateValueTypes";
import { valueMeta } from "./valueMeta";

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
