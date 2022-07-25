import { SimpleSectionName } from "../baseSections";
import {
  BaseSectionVarbs,
  SectionVarbName,
} from "../baseSectionsDerived/baseSectionTypes";
import { StateValue } from "../baseSectionsUtils/baseValues/StateValueTypes";
import { ValueName } from "../baseSectionsUtils/baseVarb";
import { valueMeta } from "./valueMeta";

export type ValueSchemas = typeof valueMeta;
export type ValueNamesToTypes = {
  [VN in ValueName]: ReturnType<ValueSchemas[VN]["initDefault"]>;
};

export type SectionValues<SN extends SimpleSectionName> = {
  [VN in SectionVarbName<SN>]: ValueNamesToTypes[BaseSectionVarbs<SN>[VN] &
    keyof ValueNamesToTypes];
};

export type VarbValue<
  SN extends SimpleSectionName,
  VN extends SectionVarbName<SN>
> = SectionValues<SN>[VN];

export type SectionValuesReq = {
  [varbName: string]: ValueName;
};
export type SectionValuesRes<VNS extends SectionValuesReq> = {
  [VN in keyof VNS]: ValueNamesToTypes[VNS[VN]];
};

export type DbValue = StateValue;

export type UpdateFnName =
  ValueSchemas[keyof ValueSchemas]["updateFnNames"][number];
