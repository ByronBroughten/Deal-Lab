import { SubType } from "../../utils/types";
import { StateValue } from "../baseSectionsUtils/baseValues/StateValueTypes";
import { ValueName } from "../baseSectionsUtils/baseVarb";
import {
  BaseSectionsVarbs,
  baseSectionsVarbs,
  SimpleSectionName,
  simpleSectionNames,
} from "../baseSectionsVarbs";
import { Obj } from "./../../utils/Obj";
import { baseNameArrs, BaseNameArrs, BaseNameSelector } from "./baseNameArrs";

export type VarbValues = { [varbName: string]: StateValue };

export type BaseName<
  ST extends BaseNameSelector = "all",
  NameArrs = BaseNameArrs[ST]
> = NameArrs[number & keyof NameArrs];

export type BaseSectionVarbs<SN extends SimpleSectionName> =
  BaseSectionsVarbs[SN];

export type VarbNameNext<SN extends SimpleSectionName> =
  keyof BaseSectionVarbs<SN>;

export function sectionVarbNames<SN extends SimpleSectionName>(
  sectionName: SN
): VarbNameNext<SN>[] {
  return Obj.keys(baseSectionsVarbs[sectionName]);
}
export function sectionVarbType<
  SN extends SimpleSectionName,
  VN extends VarbNameNext<SN>
>(sectionName: SN, varbName: VN) {
  const baseVarbs = baseSectionsVarbs[sectionName];
  return baseVarbs[varbName as keyof typeof baseVarbs];
}

type SectionVarbNames<
  SN extends SimpleSectionName,
  VN extends VarbNameNext<SN> = VarbNameNext<SN>
> = {
  [V in VN]: `${SN}.${V & string}`;
};

export type SectionVarbName<
  SN extends SimpleSectionName = SimpleSectionName,
  VN extends VarbNameNext<SN> = VarbNameNext<SN>
> = SectionVarbNames<SN, VN>[VN];

export function sectionDotVarbName<
  SN extends SimpleSectionName,
  VN extends VarbNameNext<SN>
>(sectionName: SN, varbName: VN): SectionVarbName<SN, VN> {
  return `${sectionName}.${varbName}` as SectionVarbName<SN, VN>;
}

export function sectionDotVarbNames<SN extends SimpleSectionName>(
  sectionName: SN
): SectionVarbName<SN>[] {
  const names: SectionVarbName<SN>[] = [];
  const varbNames = sectionVarbNames(sectionName);
  for (const varbName of varbNames) {
    names.push(sectionDotVarbName(sectionName, varbName));
  }
  return names;
}

type AllSectionVarbNames = {
  [SN in SimpleSectionName]: SectionVarbName<SN>;
};

export type SimpleSectionVarbName = AllSectionVarbNames[SimpleSectionName];
export const simpleSectionVarbNames = simpleSectionNames.reduce(
  (names, sectionName) => {
    return names.concat(sectionDotVarbNames(sectionName));
  },
  [] as SimpleSectionVarbName[]
);

export type VarbNameNextByType<
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
