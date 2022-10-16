import { Obj } from "../../utils/Obj";
import { RemoveNotStrings, StrictOmit } from "../../utils/types";
import { MergeUnionObj } from "../../utils/types/mergeUnionObj";
import { childSections, ChildSections } from "../childSections";
import { SectionName, sectionNames } from "../SectionName";
import { ChildSectionName } from "./ChildSectionName";

type SectionToCN = {
  [SN in SectionName]: keyof ChildSections[SN];
};
export type ChildName<SN extends SectionName = SectionName> = SectionToCN[SN];

type SectionToChildren = RemoveNotStrings<SectionToCN>;

export type HasChildSectionName = keyof SectionToChildren;
export const hasChildSectionNames = sectionNames.filter((sectionName) => {
  return Obj.keys(childSections[sectionName]).length > 0;
}) as HasChildSectionName[];

type SectionToChildNameArrs = {
  [SN in SectionName]: ChildName<SN>[];
};

export const sectionToChildNames = sectionNames.reduce((arrs, sectionName) => {
  arrs[sectionName] = Obj.keys(childSections[sectionName]);
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
