import { StrictExtract } from "../../../utils/types";
import { BaseSections, SimpleSectionName } from "../../baseSections";
import { StateValue } from "../../baseSectionsUtils/baseValues/StateValueTypes";
import { ValueName } from "../../baseSectionsUtils/baseVarb";
import { valueMeta } from "../valueMeta";

export type ValueSchemas = typeof valueMeta;
export type ValueTypes = {
  [Prop in ValueName]: ReturnType<ValueSchemas[Prop]["initDefault"]>;
};
export type EditorValueTypeName = StrictExtract<
  ValueName,
  "string" | "numObj" | "stringArray"
>;

export type DbValue = StateValue;

export type SchemaVarbsToValues<T extends Record<string, keyof ValueTypes>> = {
  [Prop in keyof T]: ValueTypes[T[Prop]];
};
export type SchemaVarbsToDbValues<T extends Record<string, keyof ValueTypes>> =
  {
    [Prop in keyof T]: ValueTypes[T[Prop]];
  };

export type SafeDbVarbs<SN extends SimpleSectionName> = SchemaVarbsToDbValues<
  BaseSections["fe"][SN]["varbSchemas"]
>;

export type UpdateFnName =
  ValueSchemas[keyof ValueSchemas]["updateFnNames"][number];
