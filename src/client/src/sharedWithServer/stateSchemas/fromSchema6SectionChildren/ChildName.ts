import { ValidationError } from "../../utils/Error";
import { Obj } from "../../utils/Obj";
import { RemoveNotStrings, StrictOmit } from "../../utils/types";
import { MergeUnionObj } from "../../utils/types/mergeUnionObj";
import { SectionName, sectionNames } from "../schema2SectionNames";
import {
  AllSectionChildren,
  allSectionChildren,
} from "../schema6SectionChildren";
import { StoreName } from "../schema6SectionChildren/sectionStores";
import { ChildSectionName } from "./ChildSectionName";

type SectionToCN = {
  [SN in SectionName]: keyof AllSectionChildren[SN];
};
export type ChildName<SN extends SectionName = SectionName> = string &
  SectionToCN[SN];

const allChildNames = Obj.keys(allSectionChildren).reduce(
  (allChildNames, sectionName) => {
    const childNames = Obj.keys(allSectionChildren[sectionName]);
    return [...new Set([...allChildNames, ...childNames])];
  },
  [] as ChildName[]
);

type SectionToChildren = RemoveNotStrings<SectionToCN>;

export type HasChildSectionName = keyof SectionToChildren;
export const hasChildSectionNames = sectionNames.filter((sectionName) => {
  return Obj.keys(allSectionChildren[sectionName]).length > 0;
}) as HasChildSectionName[];

type SectionToChildNameArrs = {
  [SN in SectionName]: ChildName<SN>[];
};

export const sectionToChildNames = sectionNames.reduce((arrs, sectionName) => {
  arrs[sectionName] = Obj.keys(allSectionChildren[sectionName]);
  return arrs;
}, {} as SectionToChildNameArrs);
export function getChildNames<SN extends SectionName>(
  sectionName: SN
): ChildName<SN>[] {
  return sectionToChildNames[sectionName] as ChildName<SN>[];
}
export function isChildName<SN extends SectionName>(
  sectionName: SN,
  childName: any
): childName is ChildName<SN> {
  const childNames = getChildNames(sectionName);
  return childNames.includes(childName);
}
export function validateChildName<
  SN extends SectionName,
  CN extends ChildName<SN> = ChildName<SN>
>(sectionName: SN, childName: any, validNames?: readonly CN[]): CN {
  const names = (validNames ?? getChildNames(sectionName)) as CN[];
  if (names.includes(childName)) {
    return childName;
  } else throw new Error(`"${childName}" is not a childName of ${sectionName}`);
}

export function validateAnyChildName(value: any): ChildName {
  if (allChildNames.includes(value)) {
    return value;
  } else {
    throw new ValidationError(`value "${value}" is not a childName`);
  }
}

export type GeneralChildIdArrs = {
  [key: string]: string[];
};
export type ChildIdArrsWide<SN extends SectionName> = {
  [CHN in ChildName<SN>]: string[];
};
type AllChildIdArrs = {
  [SN in SectionName]: ChildIdArrsWide<SN>;
};
export type ChildIdArrsNext<SN extends SectionName> = AllChildIdArrs[SN];
export type ChildIdArrsNarrow<SN extends SectionName> = MergeUnionObj<
  AllChildIdArrs[SN]
>;

export type DescendantIds = { [descendantName: string]: string[] };

export type FeChildInfo<
  SN extends SectionName,
  CN extends ChildName<SN> = ChildName<SN>
> = {
  childName: CN;
  feId: string;
};

export interface ChildArrInfo<SN extends SectionName>
  extends StrictOmit<FeChildInfo<SN>, "feId"> {
  feIds: string[];
}

export type DbChildInfo<
  SN extends SectionName,
  CN extends ChildName<SN> = ChildName<SN>
> = {
  childName: CN;
  dbId: string;
};

export interface CreateChildInfo<SN extends SectionName = SectionName>
  extends FeChildInfo<SN> {
  idx?: number;
}

export type ChildSectionNameOrNull<
  SN extends SectionName,
  CN extends SectionName
> = Extract<ChildSectionName<SN>, CN> extends never ? null : CN;

export type SectionStoreChildName<SN extends SectionName> = Extract<
  StoreName,
  ChildName<SN>
>;
