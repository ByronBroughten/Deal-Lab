import { BaseSections, SimpleSectionName } from "../../baseSections";
import { StateValue } from "../../baseSectionsUtils/baseValues/StateValueTypes";
import { ValueName } from "../../baseSectionsUtils/baseVarb";
import { valueMeta } from "../valueMeta";

export type ValueSchemas = typeof valueMeta;
export type ValueNamesToTypes = {
  [VN in ValueName]: ReturnType<ValueSchemas[VN]["initDefault"]>;
};

export type SectionValuesReq = {
  [varbName: string]: ValueName;
};
export type SectionValuesRes<VNS extends SectionValuesReq> = {
  [VN in keyof VNS]: ValueNamesToTypes[VNS[VN]];
};

export type DbValue = StateValue;

export type SchemaVarbsToValues<
  T extends Record<string, keyof ValueNamesToTypes>
> = {
  [Prop in keyof T]: ValueNamesToTypes[T[Prop]];
};
export type SchemaVarbsToDbValues<
  T extends Record<string, keyof ValueNamesToTypes>
> = {
  [Prop in keyof T]: ValueNamesToTypes[T[Prop]];
};

type SectionVarbSchemas<SN extends SimpleSectionName> =
  BaseSections[SN]["varbSchemas"];

export type SectionValues<SN extends SimpleSectionName> = {
  [VN in keyof SectionVarbSchemas<SN>]: ValueNamesToTypes[SectionVarbSchemas<SN>[VN] &
    keyof ValueNamesToTypes];
};

export type SafeDbVarbs<SN extends SimpleSectionName> = SchemaVarbsToDbValues<
  BaseSections[SN]["varbSchemas"]
>;

export type UpdateFnName =
  ValueSchemas[keyof ValueSchemas]["updateFnNames"][number];
