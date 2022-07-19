import { SubType } from "../../utils/types";
import { BaseSections, SimpleSectionName } from "../baseSections";
import { StateValue } from "../baseSectionsUtils/baseValues/StateValueTypes";
import { ValueName } from "../baseSectionsUtils/baseVarb";
import { baseNameArrs, BaseNameArrs, BaseNameSelector } from "./baseNameArrs";

export type VarbValues = { [varbName: string]: StateValue };

export type BaseName<
  ST extends BaseNameSelector = "all",
  NameArrs = BaseNameArrs[ST]
> = NameArrs[number & keyof NameArrs];

export type BaseSectionVarbs<SN extends SimpleSectionName> =
  BaseSections[SN]["varbSchemas"];

export type SectionVarbName<SN extends SimpleSectionName> =
  keyof BaseSectionVarbs<SN>;

export type SectionVarbNameByType<
  SN extends SimpleSectionName,
  VLN extends ValueName
> = keyof SubType<BaseSectionVarbs<SN>, VLN>;

function isBaseName<T extends BaseNameSelector = "all">(
  value: any,
  type?: T
): value is BaseName<T> {
  const names: readonly string[] = baseNameArrs[type ?? "all"];
  return names.includes(value);
}
