import { baseSectionsVarbs } from "../baseSectionsVarbs";
import { StateValue } from "../baseSectionsVarbs/baseValues/StateValueTypes";
import { ValueName } from "../baseSectionsVarbs/baseVarb";
import { BaseVarbSchemas } from "../baseSectionsVarbs/baseVarbs";
import { SectionName } from "../SectionName";
import { VarbName, VarbValueName } from "./baseSectionsVarbsTypes";
import { VarbNamesNext } from "./baseVarbInfo";
import { valueMeta } from "./valueMeta";

export type ValueSchemas = typeof valueMeta;
export type ValueNamesToTypes = {
  [VN in ValueName]: ReturnType<ValueSchemas[VN]["initDefault"]>;
};

type Test<SN extends SectionName, VN extends VarbName<SN>> = VarbValueName<
  SN,
  VN
>;

export type SectionValues<SN extends SectionName> = {
  [VN in VarbName<SN>]: ValueNamesToTypes[VarbValueName<SN, VN>];
};
export type SomeSectionValues<SN extends SectionName> = Partial<
  SectionValues<SN>
>;

export type VarbValue<
  SN extends SectionName,
  VN extends VarbName<SN>
> = SectionValues<SN>[VN];
export function isVarbValue<SN extends SectionName, VN extends VarbName<SN>>(
  value: any,
  { sectionName, varbName }: VarbNamesNext<SN, VN>
): value is VarbValue<SN, VN> {
  const baseVarbs = baseSectionsVarbs[sectionName] as BaseVarbSchemas;
  const valueName = baseVarbs[varbName as string];
  return valueMeta[valueName].is(value);
}

export type SectionValuesReq = {
  [varbName: string]: ValueName;
};
export type SectionValuesRes<VNS extends SectionValuesReq> = {
  [VN in keyof VNS]: ValueNamesToTypes[VNS[VN]];
};

export type DbValue = StateValue;

export type UpdateFnName<VN extends ValueName = ValueName> =
  ValueSchemas[VN]["updateFnNames"][number];
