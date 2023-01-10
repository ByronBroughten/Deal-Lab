import { Obj } from "../../utils/Obj";
import { SubType } from "../../utils/types";
import { baseSectionsVarbs, BaseSectionsVarbs } from "../allBaseSectionVarbs";
import { StateValue } from "../baseSectionsVarbs/baseValues/StateValueTypes";
import { ValueName } from "../baseSectionsVarbs/baseVarbDepreciated";
import { SectionName, sectionNames } from "../SectionName";

export type VarbValues = { [varbName: string]: StateValue };

export type BaseSectionVarbs<SN extends SectionName> = BaseSectionsVarbs[SN];
export type VarbName<SN extends SectionName> = keyof BaseSectionVarbs<SN>;
export type VarbValueName<
  SN extends SectionName,
  VN extends VarbName<SN>
> = Extract<
  ValueName,
  BaseSectionVarbs<SN>[VN][keyof BaseSectionVarbs<SN>[VN] & "valueName"]
>;

export function sectionVarbNames<SN extends SectionName>(
  sectionName: SN
): VarbName<SN>[] {
  return Obj.keys(baseSectionsVarbs[sectionName]);
}
export function sectionVarbValueName<
  SN extends SectionName,
  VN extends VarbName<SN>
>(sectionName: SN, varbName: VN): VarbValueName<SN, VN> {
  const baseVarbs = baseSectionsVarbs[sectionName][varbName];
  return baseVarbs[
    "valueName" as "valueName" & keyof typeof baseVarbs
  ] as VarbValueName<SN, VN>;
}

export type VarbNamesInfo<SN extends SectionName, VN extends VarbName<SN>> = {
  sectionName: SN;
  varbNames: readonly VN[];
};

export function makeVarbNamesInfo<
  SN extends SectionName,
  VN extends VarbName<SN>
>(sectionName: SN, varbNames: readonly VN[]): VarbNamesInfo<SN, VN> {
  return {
    sectionName,
    varbNames,
  };
}

type SectionDotVarbNames<
  SN extends SectionName,
  VN extends VarbName<SN> = VarbName<SN>
> = {
  [V in VN]: `${SN}.${V & string}`;
};

export type SectionDotVarbName<
  SN extends SectionName = SectionName,
  VN extends VarbName<SN> = VarbName<SN>
> = SectionDotVarbNames<SN, VN>[VN];

export function sectionDotVarbName<
  SN extends SectionName,
  VN extends VarbName<SN>
>(sectionName: SN, varbName: VN): SectionDotVarbName<SN, VN> {
  return `${sectionName}.${varbName}` as SectionDotVarbName<SN, VN>;
}

export function sectionDotVarbNames<SN extends SectionName>(
  sectionName: SN
): SectionDotVarbName<SN>[] {
  const names: SectionDotVarbName<SN>[] = [];
  const varbNames = sectionVarbNames(sectionName);
  for (const varbName of varbNames) {
    names.push(sectionDotVarbName(sectionName, varbName));
  }
  return names;
}

type AllSectionVarbNames = {
  [SN in SectionName]: SectionDotVarbName<SN>;
};

export type SimpleSectionVarbName = AllSectionVarbNames[SectionName];
export const simpleSectionVarbNames = sectionNames.reduce(
  (names, sectionName) => {
    return names.concat(sectionDotVarbNames(sectionName));
  },
  [] as SimpleSectionVarbName[]
);

export type VarbNameByValueName<
  SN extends SectionName,
  VLN extends ValueName
> = keyof SubType<BaseSectionVarbs<SN>, VLN>;
