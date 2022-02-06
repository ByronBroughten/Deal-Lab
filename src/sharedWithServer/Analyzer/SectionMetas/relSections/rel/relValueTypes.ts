import { z } from "zod";
import { relValue } from "./relValue";

export type ValueSchemas = typeof relValue;
export type ValueTypes = {
  [Prop in keyof ValueSchemas]: ReturnType<ValueSchemas[Prop]["defaultInit"]>;
};
export type ValueTypeName = keyof ValueTypes;

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

export type UpdateFnName =
  ValueSchemas[keyof ValueSchemas]["updateFnNames"][number];
