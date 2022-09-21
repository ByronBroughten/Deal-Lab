import { SubType } from "../../utils/types";
import {
  BaseSections,
  SimpleSectionName,
  simpleSectionNames,
} from "../baseSections";
import { StateValue } from "../baseSectionsUtils/baseValues/StateValueTypes";
import { ValueName } from "../baseSectionsUtils/baseVarb";
import { Obj } from "./../../utils/Obj";
import { baseSections } from "./../baseSections";
import { baseNameArrs, BaseNameArrs, BaseNameSelector } from "./baseNameArrs";

export type VarbValues = { [varbName: string]: StateValue };

export type BaseName<
  ST extends BaseNameSelector = "all",
  NameArrs = BaseNameArrs[ST]
> = NameArrs[number & keyof NameArrs];

export type BaseSectionVarbs<SN extends SimpleSectionName> =
  BaseSections[SN]["varbSchemas"];

export type VarbNameNext<SN extends SimpleSectionName> =
  keyof BaseSectionVarbs<SN>;

export function sectionVarbNames<SN extends SimpleSectionName>(
  sectionName: SN
): VarbNameNext<SN>[] {
  return Obj.keys(baseSections[sectionName].varbSchemas);
}
export function sectionVarbType<
  SN extends SimpleSectionName,
  VN extends VarbNameNext<SN>
>(sectionName: SN, varbName: VN) {
  const varbSchemas = baseSections[sectionName].varbSchemas;
  return varbSchemas[varbName as keyof typeof varbSchemas];
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
