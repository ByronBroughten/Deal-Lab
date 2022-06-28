import { Obj } from "../../utils/Obj";
import { PropKeysOfValue } from "../../utils/Obj/SubType";
import { RemoveNotStrings, StrictOmit } from "../../utils/types";
import { MergeUnionObj } from "../../utils/types/mergeUnionObj";
import { SimpleSectionName, simpleSectionNames } from "../baseSections";
import { BaseName } from "../baseSectionTypes";
import { BaseNameSelector } from "../baseSectionTypes/baseNameArrs";
import { RelSections } from "../relSections";
import { GeneralRelSection } from "../relSections/rel/relSection";
import { relSections } from "./../relSections";

type ChildNameArr<SN extends SimpleSectionName> =
  (keyof RelSections[SN]["children"])[];

type SectionToChildrenOrNever = {
  [SN in SimpleSectionName]: ChildNameArr<SN>[number & keyof ChildNameArr<SN>];
};

type SectionToChildren = RemoveNotStrings<SectionToChildrenOrNever>;

export type HasChildSectionName = keyof SectionToChildren;

export type ChildName<SN extends SimpleSectionName = SimpleSectionName> =
  SectionToChildrenOrNever[SN];

type SectionToChildNameArrs = {
  [SN in SimpleSectionName]: ChildName<SN>[];
};
const sectionToChildNames = simpleSectionNames.reduce((arrs, sectionName) => {
  arrs[sectionName] = Obj.keys(relSections[sectionName].children);
  return arrs;
}, {} as SectionToChildNameArrs);

type SectionToChildTypeArrs = {
  [SN in SimpleSectionName]: ChildType<SN>[];
};
export const sectionToChildTypes = simpleSectionNames.reduce(
  (arrs, sectionName) => {
    const childNames = sectionToChildNames[sectionName];
    const relSection = relSections[sectionName] as GeneralRelSection;
    const types = childNames.map(
      (childName) => relSection.children[childName].sectionName
    );
    (arrs[sectionName] as SimpleSectionName[]) = types;
    return arrs;
  },
  {} as SectionToChildTypeArrs
);

type RelChildren<SN extends SimpleSectionName> = RelSections[SN]["children"];
type RelChild<
  SN extends SimpleSectionName,
  CN extends ChildName<SN>
> = RelChildren<SN>[CN & keyof RelChildren<SN>];

export type ChildNamesToTypes<SN extends SimpleSectionName> = {
  [CN in ChildName<SN>]: ChildType<SN, CN>;
};
export type ChildTypesToNames<SN extends SimpleSectionName> = {
  [CT in ChildType<SN>]: ChildTypeName<SN, CT>[];
};

export type ChildTypeName<
  SN extends SimpleSectionName,
  ST extends BaseNameSelector
> = PropKeysOfValue<ChildNamesToTypes<SN>, BaseName<ST> & ChildType<SN>>;

type SectionChildNamesToType = {
  [SN in SimpleSectionName]: ChildNamesToTypes<SN>;
};

type SectionChildTypesToNames = {
  [SN in SimpleSectionName]: ChildTypesToNames<SN>;
};

function childTypesToNames<SN extends SimpleSectionName>(
  sectionName: SN
): ChildTypesToNames<SN> {
  const childTypes = sectionToChildTypes[sectionName] as string[];
  const namesToType = sectionChildNamesToType[sectionName] as {
    [key: string]: string;
  };
  return childTypes.reduce((toNames, childType) => {
    const test = Obj.propKeysOfValue(namesToType, childType);
    (toNames as any)[childType] = test;
    return toNames;
  }, {} as ChildTypesToNames<SN>);
}
export const sectionChildTypesToNames = simpleSectionNames.reduce(
  (toNames, sectionName) => {
    (toNames as any)[sectionName] = childTypesToNames(sectionName);
    return toNames;
  },
  {} as SectionChildTypesToNames
);

function childNamesToTypes<SN extends SimpleSectionName>(
  sectionName: SN
): ChildNamesToTypes<SN> {
  const childNames = sectionToChildNames[sectionName] as string[];
  const relSection = relSections[sectionName] as GeneralRelSection;
  return childNames.reduce((toTypes, childName) => {
    (toTypes as any)[childName] =
      relSection["children"][childName]["sectionName"];
    return toTypes;
  }, {} as ChildNamesToTypes<SN>);
}
export const sectionChildNamesToType = simpleSectionNames.reduce(
  (toTypes, sectionName) => {
    toTypes[sectionName] = childNamesToTypes(sectionName);
    return toTypes;
  },
  {} as SectionChildNamesToType
);

export type ChildType<
  SN extends SimpleSectionName,
  CN extends ChildName<SN> = ChildName<SN>
> = RelChild<SN, CN>["sectionName" & keyof RelChild<SN, CN>] &
  SimpleSectionName;

export type DescendantType<SN extends SimpleSectionName> =
  ChildType<SN> extends never
    ? never
    : ChildType<SN> | DescendantType<ChildType<SN>>;

export type SelfOrDescendantType<SN extends SimpleSectionName> =
  | SN
  | DescendantType<SN>;

export type DescendantIds<SN extends SimpleSectionName> = {
  [S in DescendantType<SN>]: string[];
};
export type SelfAndDescendantIds<SN extends SimpleSectionName> = {
  [S in SelfOrDescendantType<SN>]: string[];
};

function _testDescendantType() {
  type SN = "propertyGeneral";
  type FeTest = DescendantType<SN>;
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

export type ChildTypeOrNull<
  SN extends SimpleSectionName,
  CN extends SimpleSectionName
> = Extract<ChildType<SN>, CN> extends never ? null : CN;
