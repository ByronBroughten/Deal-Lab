import { Obj } from "../../utils/Obj";
import { SubType } from "../../utils/types";
import { baseSectionsVarbs, BaseSectionsVarbs } from "../baseSectionsVarbs";
import { StateValue } from "../baseSectionsVarbs/baseValues/StateValueTypes";
import { ValueName } from "../baseSectionsVarbs/baseVarb";
import { SectionName, sectionNames } from "../SectionName";

export type VarbValues = { [varbName: string]: StateValue };

export type BaseSectionVarbs<SN extends SectionName> = BaseSectionsVarbs[SN];

export type VarbName<SN extends SectionName> = keyof BaseSectionVarbs<SN>;

export function sectionVarbNames<SN extends SectionName>(
  sectionName: SN
): VarbName<SN>[] {
  return Obj.keys(baseSectionsVarbs[sectionName]);
}
export function sectionVarbType<
  SN extends SectionName,
  VN extends VarbName<SN>
>(sectionName: SN, varbName: VN) {
  const baseVarbs = baseSectionsVarbs[sectionName];
  return baseVarbs[varbName as keyof typeof baseVarbs];
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
