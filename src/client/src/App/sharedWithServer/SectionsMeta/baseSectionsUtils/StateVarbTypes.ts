import { valueMeta } from "../relSectionsUtils/valueMeta";
import { ValueNamesToTypes } from "../relSectionsUtils/valueMetaTypes";
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
