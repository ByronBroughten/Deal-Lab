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

type BaseSectionVarbs<
  SN extends SimpleSectionName,
  BaseSection = BaseSections[SN]
> = BaseSection["varbSchemas" & keyof BaseSection];

export type SectionVarbName<SN extends SimpleSectionName> =
  keyof BaseSectionVarbs<SN>;

type Test = SectionVarbName<"property" | "loan">;

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
