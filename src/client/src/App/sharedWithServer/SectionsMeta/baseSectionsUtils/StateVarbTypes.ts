import { ValueNamesToTypes } from "../relSectionsUtils/rel/valueMetaTypes";
import { valueMeta } from "../relSectionsUtils/valueMeta";
import { StateValue } from "./baseValues/StateValueTypes";

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
