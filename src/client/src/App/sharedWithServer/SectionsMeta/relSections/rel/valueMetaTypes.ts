import { z } from "zod";
import { StrictExtract } from "../../../utils/types";
import { BaseSections, SimpleSectionName } from "../../baseSections";
import { valueMeta } from "../../baseSections/baseValues";

export type ValueSchemas = typeof valueMeta;
export type ValueTypes = {
  [Prop in keyof ValueSchemas]: ReturnType<ValueSchemas[Prop]["defaultInit"]>;
};
export type ValueTypeName = keyof ValueTypes;

export type EditorValueTypeName = StrictExtract<
  ValueTypeName,
  "string" | "numObj" | "stringArray"
>;

export type DbValueTypes = {
  [Prop in ValueTypeName]: z.infer<ValueSchemas[Prop]["dbZod"]>;
};
export type DbValue = DbValueTypes[ValueTypeName];

export type SchemaVarbsToValues<T extends Record<string, keyof ValueTypes>> = {
  [Prop in keyof T]: ValueTypes[T[Prop]];
};
export type SchemaVarbsToDbValues<
  T extends Record<string, keyof DbValueTypes>
> = {
  [Prop in keyof T]: DbValueTypes[T[Prop]];
};

export type SafeDbVarbs<SN extends SimpleSectionName> = SchemaVarbsToDbValues<
  BaseSections["fe"][SN]["varbSchemas"]
>;

export type UpdateFnName =
  ValueSchemas[keyof ValueSchemas]["updateFnNames"][number];
