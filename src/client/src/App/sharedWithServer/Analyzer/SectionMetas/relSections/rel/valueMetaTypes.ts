import { z } from "zod";
import { baseValues } from "../baseSections/baseValues";

export type ValueSchemas = typeof baseValues;
export type ValueTypes = {
  [Prop in keyof ValueSchemas]: ReturnType<ValueSchemas[Prop]["defaultInit"]>;
};
export type ValueName = keyof ValueTypes;

type DbValueTypes = {
  [Prop in keyof ValueSchemas]: z.infer<ValueSchemas[Prop]["dbZod"]>;
};

export type SchemaVarbsToValues<T extends Record<string, keyof ValueTypes>> = {
  [Prop in keyof T]: ValueTypes[T[Prop]];
};
export type SchemaVarbsToDbValues<
  T extends Record<string, keyof DbValueTypes>
> = {
  [Prop in keyof T]: DbValueTypes[T[Prop]];
};

// to make a relVarb
// get the valueName and displayName
// get the initValue or use the one from valueSchema
// get the rest or use the rest from default
const defaultRelVarb = {
  inUpdateProps: [
    {
      updateFnName: "directUpdate",
      updateFnProps: {},
    },
  ],
  startAdornment: "",
  endAdornment: "",
} as const;

function isRelVarb<T extends BaseValueName>(
  relVarb: RelVarb,
  typeName: T
): relVarb is RelVarb<T> {
  return relVarb.valueName === typeName;
}
