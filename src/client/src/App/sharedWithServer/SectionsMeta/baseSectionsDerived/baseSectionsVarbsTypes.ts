import { Obj } from "../../utils/Obj";
import { SubType } from "../../utils/types";
import {
  AllBaseSectionVarbs,
  allBaseSectionVarbs,
} from "../allBaseSectionVarbs";
import { StateValue } from "../allBaseSectionVarbs/baseValues/StateValueTypes";
import { ValueName } from "../allBaseSectionVarbs/ValueName";
import { SectionName, sectionNames } from "../SectionName";

export type VarbValues = { [varbName: string]: StateValue };

export type BaseSectionVarbs<SN extends SectionName> = AllBaseSectionVarbs[SN];
export type VarbName<SN extends SectionName = SectionName> =
  keyof BaseSectionVarbs<SN>;

type GetBaseVarb<
  SN extends SectionName,
  VN extends VarbName<SN>
> = BaseSectionVarbs<SN>[VN];
export function getBaseVarb<SN extends SectionName, VN extends VarbName<SN>>(
  sectionName: SN,
  varbName: VN
): GetBaseVarb<SN, VN> {
  return allBaseSectionVarbs[sectionName][varbName];
}

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
  return Obj.keys(allBaseSectionVarbs[sectionName]);
}
export function sectionVarbValueName<
  SN extends SectionName,
  VN extends VarbName<SN>
>(sectionName: SN, varbName: VN): VarbValueName<SN, VN> {
  const baseVarbs = allBaseSectionVarbs[sectionName][varbName];
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

type SectionVarbToValueName<SN extends SectionName> = {
  [VN in VarbName<SN>]: VarbValueName<SN, VN>;
};

export type VarbNameByValueName<
  SN extends SectionName,
  VLN extends ValueName
> = keyof SubType<SectionVarbToValueName<SN>, VLN>;
