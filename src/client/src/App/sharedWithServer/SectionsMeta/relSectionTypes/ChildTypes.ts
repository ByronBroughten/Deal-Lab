import { RemoveNotStrings } from "../../utils/types";
import { MergeUnionObj } from "../../utils/types/mergeUnionObj";
import { ContextName, SimpleSectionName } from "../baseSections";
import { FeInfoByType } from "../Info";
import { RelSections } from "../relSections";
import { FeNameInfo } from "../relSections/rel/relVarbInfoTypes";
import { SectionNameType } from "../SectionName";

type ChildNameArr<SN extends SimpleSectionName> = RelSections[SN]["childNames" &
  keyof RelSections[SN]];

type SectionToChildrenOrNever = {
  [SN in SimpleSectionName]: ChildNameArr<SN>[number & keyof ChildNameArr<SN>];
};

type SectionToChildren = RemoveNotStrings<SectionToChildrenOrNever>;

export type ChildName<SN extends SimpleSectionName = SimpleSectionName> =
  SectionToChildrenOrNever[SN];

export type DescendantName<
  SN extends SimpleSectionName,
  CN extends ContextName = "fe"
> = ChildName<SN> extends never
  ? never
  : ChildName<SN> | DescendantName<ChildName<SN>, CN>;

export type SelfOrDescendantName<
  SN extends SimpleSectionName,
  CN extends ContextName = "fe"
> = SN | DescendantName<SN, CN>;

export type DescendantIds<
  SN extends SimpleSectionName,
  CN extends ContextName = "fe"
> = {
  [S in DescendantName<SN, CN>]: string[];
};

export type SelfAndDescendantIds<
  SN extends SimpleSectionName = SimpleSectionName
> = {
  [S in SelfOrDescendantName<SN, "fe">]: string[];
};

function _testDescendantName() {
  type SN = "propertyGeneral";
  type FeTest = DescendantName<SN, "fe">;
  const _test1: FeTest = "unit";
  // @ts-expect-error
  const _test3: FeTest = "loan";
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

export interface ChildFeInfo<SN extends SimpleSectionName> extends FeNameInfo {
  sectionName: ChildName<SN>;
}

export type FeChildInfo<SN extends SimpleSectionName> = {
  sectionName: ChildName<SN>;
  feId: string;
};

export interface NewChildInfo<
  SN extends SimpleSectionName = SimpleSectionName,
  CN extends ChildName<SN> = ChildName<SN>
> extends NewSectionInfo<CN> {
  sectionName: CN;
}

export interface NewDescendantInfo<
  SN extends SimpleSectionName = SimpleSectionName,
  DN extends DescendantName<SN> = DescendantName<SN>
> extends NewSectionInfo<DN> {}

export interface NewSectionInfo<ST extends SectionNameType>
  extends FeInfoByType<ST> {
  idx?: number | undefined;
}

export type HasChildSectionName<SC extends ContextName> =
  keyof SectionToChildren;

export type ChildOrNull<
  SN extends SimpleSectionName,
  CN extends SimpleSectionName
> = Extract<ChildNameArr<SN>[number & keyof ChildNameArr<SN>], CN> extends never
  ? null
  : CN;
