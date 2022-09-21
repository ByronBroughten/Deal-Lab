import { Obj } from "../../utils/Obj";
import { RemoveNotStrings, StrictOmit } from "../../utils/types";
import { MergeUnionObj } from "../../utils/types/mergeUnionObj";
import { SimpleSectionName, simpleSectionNames } from "../baseSectionsVarbs";
import { childSections, ChildSections } from "../childSections";
import { ChildSectionName } from "./ChildSectionName";

type SectionToCN = {
  [SN in SimpleSectionName]: keyof ChildSections[SN];
};
export type ChildName<SN extends SimpleSectionName = SimpleSectionName> =
  SectionToCN[SN];

type SectionToChildren = RemoveNotStrings<SectionToCN>;

export type HasChildSectionName = keyof SectionToChildren;
export const hasChildSectionNames = simpleSectionNames.filter((sectionName) => {
  return Obj.keys(childSections[sectionName]).length > 0;
}) as HasChildSectionName[];

type SectionToChildNameArrs = {
  [SN in SimpleSectionName]: ChildName<SN>[];
};

export const sectionToChildNames = simpleSectionNames.reduce(
  (arrs, sectionName) => {
    arrs[sectionName] = Obj.keys(childSections[sectionName]);
    return arrs;
  },
  {} as SectionToChildNameArrs
);
export function getChildNames<SN extends SimpleSectionName>(
  sectionName: SN
): ChildName<SN>[] {
  return sectionToChildNames[sectionName] as ChildName<SN>[];
}

export type GeneralChildIdArrs = {
  [key: string]: string[];
};
export type ChildIdArrsWide<SN extends SimpleSectionName> = {
  [CHN in ChildName<SN>]: string[];
};
type AllChildIdArrs = {
  [SN in SimpleSectionName]: ChildIdArrsWide<SN>;
};
export type ChildIdArrsNext<SN extends SimpleSectionName> = AllChildIdArrs[SN];
export type ChildIdArrsNarrow<SN extends SimpleSectionName> = MergeUnionObj<
  AllChildIdArrs[SN]
>;

export type FeChildInfo<
  SN extends SimpleSectionName,
  CN extends ChildName<SN> = ChildName<SN>
> = {
  childName: CN;
  feId: string;
};

export interface ChildArrInfo<SN extends SimpleSectionName>
  extends StrictOmit<FeChildInfo<SN>, "feId"> {
  feIds: string[];
}

export type DbChildInfo<
  SN extends SimpleSectionName,
  CN extends ChildName<SN> = ChildName<SN>
> = {
  childName: CN;
  dbId: string;
};

export interface CreateChildInfo<
  SN extends SimpleSectionName = SimpleSectionName
> extends FeChildInfo<SN> {
  idx?: number;
}

export type ChildSectionNameOrNull<
  SN extends SimpleSectionName,
  CN extends SimpleSectionName
> = Extract<ChildSectionName<SN>, CN> extends never ? null : CN;
