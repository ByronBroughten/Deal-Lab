import {
  AllBaseSectionVarbs,
  allBaseSectionVarbs,
} from "../../stateSchemas/allBaseSectionVarbs";
import {
  GroupKey,
  GroupName,
  groupVarbName,
} from "../../stateSchemas/GroupName";
import { SectionName, sectionNames } from "../../stateSchemas/SectionName";
import { ValidationError } from "../../utils/Error";
import { Obj } from "../../utils/Obj";

export type BaseSectionVarbs<SN extends SectionName> = AllBaseSectionVarbs[SN];
export type VarbName<SN extends SectionName = SectionName> = string &
  keyof BaseSectionVarbs<SN>;

type SectionVarbNames = {
  [SN in SectionName]: keyof BaseSectionVarbs<SN>;
};

const allVarbNamesRepeats = sectionNames.reduce((allVarbNames, sectionName) => {
  const varbNames = Obj.keys(allBaseSectionVarbs[sectionName]);
  return allVarbNames.concat(...varbNames);
}, [] as VarbNameWide[]);

const allVarbNames = [...new Set(allVarbNamesRepeats)];
function isVarbName(value: any): value is VarbNameWide {
  return allVarbNames.includes(value);
}
export function validateAnyVarbName(value: any): VarbNameWide {
  if (isVarbName(value)) {
    return value;
  } else {
    throw new Error(`value "${value}" is not a varbName`);
  }
}
export function safeGroupVarbName<
  BN extends string,
  GN extends GroupName,
  GK extends GroupKey<GN>
>(baseName: BN, groupName: GN, groupKey: GK): VarbNameWide {
  return validateAnyVarbName(groupVarbName(baseName, groupName, groupKey));
}

export function validateAnyVarbNames(value: any): VarbNameWide[] {
  if (Array.isArray(value) && value.every((vn) => isVarbName(vn))) {
    return value;
  } else {
    throw new Error(`value "${value}" is not a varbName`);
  }
}

export type VarbNameWide<SN extends SectionName = SectionName> =
  SectionVarbNames[SN];

export interface VnProp<
  SN extends SectionName = SectionName,
  VN extends VarbNameWide<SN> = VarbNameWide<SN>
> {
  varbName: VN;
}

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

export function validateSectionVarbName<SN extends SectionName>(
  sectionName: SN,
  value: any
): VarbName<SN> {
  const varbNames = sectionVarbNames(sectionName);
  if (varbNames.includes(value)) {
    return value;
  } else {
    throw new ValidationError(
      `value "${value} is not a varbName of ${sectionName}"`
    );
  }
}
export function sectionVarbNames<SN extends SectionName>(
  sectionName: SN
): VarbName<SN>[] {
  return Obj.keys(allBaseSectionVarbs[sectionName]);
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
