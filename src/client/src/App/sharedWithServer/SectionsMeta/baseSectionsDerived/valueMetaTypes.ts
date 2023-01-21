import {
  allBaseSectionVarbs,
  GeneralBaseSectionVarbs,
} from "../allBaseSectionVarbs";
import { StateValue } from "../allBaseSectionVarbs/baseValues/StateValueTypes";
import { ValueName } from "../allBaseSectionVarbs/ValueName";
import { SectionName } from "../SectionName";
import { VarbName, VarbValueName } from "./baseSectionsVarbsTypes";
import { VarbNamesNext } from "./baseVarbInfo";
import { valueMetas } from "./valueMetas";

type ValueMetas = typeof valueMetas;
export type ValueNamesToTypes = {
  [VN in ValueName]: ReturnType<ValueMetas[VN]["initDefault"]>;
};
export type ValueByValueName<VN extends ValueName> = ValueNamesToTypes[VN];

export type SectionValues<SN extends SectionName> = {
  [VN in VarbName<SN>]: ValueNamesToTypes[VarbValueName<SN, VN>];
};

export type SomeSectionValues<SN extends SectionName> = Partial<
  SectionValues<SN>
>;

// I must separate the tools for making the configuration from the configuration

export type VarbValue<
  SN extends SectionName,
  VN extends VarbName<SN>
> = SectionValues<SN>[VN];
export function isVarbValue<SN extends SectionName, VN extends VarbName<SN>>(
  value: any,
  { sectionName, varbName }: VarbNamesNext<SN, VN>
): value is VarbValue<SN, VN> {
  const baseVarbs = allBaseSectionVarbs[sectionName] as GeneralBaseSectionVarbs;
  const valueName = baseVarbs[varbName as string].valueName;
  return valueMetas[valueName].is(value);
}

export type SectionValuesReq = {
  [varbName: string]: ValueName;
};
export type SectionValuesRes<VNS extends SectionValuesReq> = {
  [VN in keyof VNS]: ValueNamesToTypes[VNS[VN]];
};

export type DbValue = StateValue;
