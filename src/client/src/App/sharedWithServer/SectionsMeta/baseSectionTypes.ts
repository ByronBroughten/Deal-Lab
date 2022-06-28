import { SubType } from "../utils/types";
import { BaseSections, ContextName, SimpleSectionName } from "./baseSections";
import { StateValue } from "./baseSections/baseValues/StateValueTypes";
import { ValueName } from "./baseSections/baseVarb";
import {
  baseNameArrs,
  BaseNameArrs,
  BaseNameSelector,
} from "./baseSectionTypes/baseNameArrs";

export type VarbValues = { [varbName: string]: StateValue };

export type BaseName<
  ST extends BaseNameSelector = "all",
  SC extends ContextName = "fe",
  NameArrs = BaseNameArrs[SC][ST]
> = NameArrs[number & keyof NameArrs];

type BaseSectionVarbs<
  SN extends SimpleSectionName,
  BaseSection = BaseSections["fe"][SN]
> = BaseSection["varbSchemas" & keyof BaseSection];

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
  const names: readonly string[] = baseNameArrs["fe"][type ?? "all"];
  return names.includes(value);
}
