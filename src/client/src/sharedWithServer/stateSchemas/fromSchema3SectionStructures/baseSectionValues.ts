import { SubType } from "../../utils/types";
import { ValueName } from "../schema1ValueNames";
import { SectionName } from "../schema2SectionNames";
import { schema2SectionStructures } from "../schema3SectionStructures";
import { valueTraits } from "../schema4ValueTraits";
import { VarbValue } from "../schema4ValueTraits/StateValue";
import { BaseSectionVarbs, VarbName } from "./baseSectionsVarbsTypes";

export function validateSectionVarbValue<
  SN extends SectionName,
  VN extends VarbName<SN>
>(sectionName: SN, varbName: VN, value: any): VarbValue<SN, VN> {
  const valueName = sectionVarbValueName(sectionName, varbName);
  return valueTraits[valueName].validate(value) as VarbValue<SN, VN>;
}

export function sectionVarbValueName<
  SN extends SectionName,
  VN extends VarbName<SN>
>(sectionName: SN, varbName: VN): VarbValueName<SN, VN> {
  const baseVarbs = schema2SectionStructures[sectionName][varbName];
  return baseVarbs[
    "valueName" as "valueName" & keyof typeof baseVarbs
  ] as VarbValueName<SN, VN>;
}

export type VarbValueName<
  SN extends SectionName,
  VN extends VarbName<SN>
> = Extract<
  ValueName,
  BaseSectionVarbs<SN>[VN][keyof BaseSectionVarbs<SN>[VN] & "valueName"]
>;

type SectionVarbToValueName<SN extends SectionName> = {
  [VN in VarbName<SN>]: VarbValueName<SN, VN>;
};

export type VarbNameByValueName<
  SN extends SectionName,
  VLN extends ValueName
> = keyof SubType<SectionVarbToValueName<SN>, VLN>;
