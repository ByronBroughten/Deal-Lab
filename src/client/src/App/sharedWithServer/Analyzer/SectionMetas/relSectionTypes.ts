import { Obj, ObjectKeys, ObjectValues } from "../../utils/Obj";
import {
  IsUnion,
  NeversToSomething,
  RemoveNotStrings,
  SubType,
} from "../../utils/typescript";
import { relSections } from "./relSections";
import {
  alwaysOneSectionNames,
  BaseName,
  baseNames,
  isBaseName,
} from "./relSections/baseSectionTypes";
import {
  FeNameInfo,
  FeSectionInfoBase,
} from "./relSections/rel/relVarbInfoTypes";
import Arr from "../../utils/Arr";

export type RelSections = typeof relSections;

type SectionToChildrenOrNever = {
  [Prop in BaseName]: RelSections[Prop]["childSectionNames"][number];
};

export type ChildName<S extends BaseName = BaseName> =
  SectionToChildrenOrNever[S];

export type DescendantName<S extends BaseName> = ChildName<S> extends never
  ? never
  : ChildName<S> | DescendantName<ChildName<S>>;
type _DescendantNameTest = DescendantName<"propertyGeneral">;
const _descendantNameTest1: _DescendantNameTest = "unit";
const _descendantNameTest2: _DescendantNameTest = "ongoingItem";
// @ts-expect-error
const _descendantNameTest3: _DescendantNameTest = "loan";

export type ChildIdArrs<S extends BaseName = BaseName> = Record<
  ChildName<S>,
  string[]
>;
type SectionToChildren = RemoveNotStrings<SectionToChildrenOrNever>;
type HasChildSectionName = keyof SectionToChildren;
const hasChildSectionNames = ObjectKeys(relSections).filter((sectionName) => {
  return relSections[sectionName].childSectionNames.length > 0;
}) as HasChildSectionName[];

type SectionToChildIdArrs = {
  [Prop in keyof SectionToChildrenOrNever]: Record<
    SectionToChildrenOrNever[Prop],
    string[]
  >;
};

type SectionToChildIdArrType = {
  [Prop in keyof SectionToChildIdArrs]: SectionToChildIdArrs[Prop][keyof SectionToChildIdArrs[Prop]];
};
export type ChildIdArrType<S extends BaseName = BaseName> =
  SectionToChildIdArrType[S];

export type ChildFeInfo<S extends BaseName> = FeNameInfo & {
  sectionName: ChildName<S>;
  id: string;
};

//
type ChildOrNull<Prop extends BaseName, ChildName extends BaseName> = Extract<
  RelSections[Prop]["childSectionNames"][number],
  ChildName
> extends never
  ? null
  : ChildName;
type ParentToChildOrNullMap<ChildName extends BaseName> = {
  [Prop in BaseName]: ChildOrNull<Prop, ChildName>;
};

type FindParents<ChildName extends BaseName> = keyof SubType<
  ParentToChildOrNullMap<ChildName>,
  ChildName
>;

type SectionToParentsOrNever = {
  [Prop in keyof RelSections]: FindParents<Prop>;
};

// this is for consistency in sectionMeta
export type SectionToParentsOrNeverArr = {
  [Prop in keyof SectionToParentsOrNever]: SectionToParentsOrNever[Prop][];
};

type SectionToParents = RemoveNotStrings<SectionToParentsOrNever>;
type SectionToParentOrNo = NeversToSomething<
  SectionToParentsOrNever,
  "no parent"
>;
function getSectionToParentObj() {
  type AllParents = Record<BaseName, BaseName[]>;
  const sectionToParentArr = ObjectKeys(relSections).reduce((parents, key) => {
    parents[key] = [];
    return parents;
  }, {} as Partial<AllParents>) as AllParents;

  for (const sectionName of ObjectKeys(relSections)) {
    for (const childName of relSections[sectionName].childSectionNames) {
      sectionToParentArr[childName].push(sectionName);
    }
  }
  return sectionToParentArr as SectionToParentsOrNeverArr;
}
export const sectionToParentArr = getSectionToParentObj();

type HasParentSectionName = keyof SectionToParents;
const hasParentSectionNames = ObjectKeys(sectionToParentArr).filter(
  (sectionName) => {
    return sectionToParentArr[sectionName].length > 0;
  }
) as HasParentSectionName[];
export type ParentName<S extends BaseName = BaseName> = SectionToParentOrNo[S];
export type FeParentInfo<S extends BaseName = BaseName> = FeSectionInfoBase & {
  sectionName: ParentName<S>;
};

export type ParentFinder<S extends BaseName> =
  | FeParentInfo<S>
  | ParentName<Extract<S, HasOneParentSectionName>>;

type SectionToOneParentOrNull = {
  [Prop in keyof SectionToParents]: IsUnion<
    SectionToParentsOrNever[Prop]
  > extends true
    ? null
    : SectionToParentsOrNever[Prop] extends BaseName<"notAlwaysOne">
    ? null
    : SectionToParentsOrNever[Prop];
};
type SectionToAlwaysOneParent = SubType<SectionToOneParentOrNull, string>;
type HasOneParentSectionName = keyof SectionToAlwaysOneParent;
const hasOneParentSectionNames = hasParentSectionNames.filter((sectionName) => {
  return (
    sectionToParentArr[sectionName].length === 1 &&
    alwaysOneSectionNames.includes(sectionToParentArr[sectionName][0] as any)
  );
}) as HasOneParentSectionName[];

type IsSingleParentName<
  S extends HasOneParentSectionName = HasOneParentSectionName
> = SectionToAlwaysOneParent[S];
const isSingleParentSectionNames = hasOneParentSectionNames.reduce(
  (names, name) => {
    const singleParentNameArr = sectionToParentArr[name];
    if (!names.includes(singleParentNameArr[0]))
      names.push(...singleParentNameArr);
    return names;
  },
  [] as IsSingleParentName[]
);

type PreUserLists = { [Prop in BaseName<"userList">]: RelSections[Prop] };
type UserListItemTypes = {
  [Prop in BaseName<"userList">]: PreUserLists[Prop]["childSectionNames"][number];
};
type UserItemSectionName = UserListItemTypes[BaseName<"userList">];
export const userListItemTypes: UserListItemTypes = {
  userSingleList: "singleTimeItem",
  userOngoingList: "ongoingItem",
  userVarbList: "userVarbItem",
} as const;
const userListItemNames = ObjectValues(
  userListItemTypes
) as UserItemSectionName[];

//
const savableSectionNames = Arr.extract(baseNames.dbStore, baseNames.all);
const hasIndexStoreNames = Obj.entryKeysWithProp(relSections, "indexStoreName");
type HasIndexStoreName = typeof hasIndexStoreNames[number];

const hasDefaultStoreNames = Obj.entryKeysWithProp(
  relSections,
  "defaultStoreName"
);
type HasDefaultStoreName = typeof hasDefaultStoreNames[number];

const savableSectionAlwaysOneNames = Arr.extract(
  savableSectionNames,
  baseNames.alwaysOne
);
const savableSectionOneParentNames = Arr.extract(
  savableSectionNames,
  hasOneParentSectionNames
);

export type IndexStoreName<S extends HasIndexStoreName = HasIndexStoreName> =
  RelSections[S]["indexStoreName"];
export type IndexParentName<S extends HasIndexStoreName> = ParentName<
  IndexStoreName<S>
>;

export type DefaultStoreName<
  S extends HasDefaultStoreName = HasDefaultStoreName
> = RelSections[S]["indexStoreName"];
export type ExtraStoreName = IndexStoreName | DefaultStoreName;
export type ExtraStoreNameAlwaysOne = Extract<
  ExtraStoreName,
  BaseName<"alwaysOne">
>;
export type ExtraStoreNameOneParent = Extract<
  ExtraStoreName,
  HasOneParentSectionName
>;

type HasRowIndexStoreName = keyof SubType<
  RelSections,
  { indexStoreName: BaseName<"rowIndex"> }
>;
const hasRowIndexStoreNames = hasIndexStoreNames.filter((sectionName) => {
  const { indexStoreName } = relSections[sectionName];
  return isBaseName(indexStoreName, "rowIndex");
}) as HasRowIndexStoreName[];

const hasFullIndexStoreNames = Arr.exclude(
  hasIndexStoreNames,
  hasRowIndexStoreNames
);

type TablePreSections = SubType<RelSections, { rowSourceName: string }>;
type SourceToTableName = {
  [Prop in keyof TablePreSections as TablePreSections[Prop]["rowSourceName"]]: Prop;
};
export const rowIndexToTableName: SourceToTableName = {
  propertyIndex: "propertyTable",
  loanIndex: "loanTable",
  mgmtIndex: "mgmtTable",
  analysisIndex: "analysisTable",
};
type SectionToRowIndexStoreName = {
  [Prop in HasRowIndexStoreName]: IndexStoreName<Prop>;
};
type RowIndexStoreToSectionName = {
  [Prop in IndexStoreName<HasRowIndexStoreName>]: keyof SubType<
    SectionToRowIndexStoreName,
    Prop
  >;
};
export const indexStoreToSectionName: RowIndexStoreToSectionName = {
  propertyIndex: "property",
  loanIndex: "loan",
  mgmtIndex: "mgmt",
  analysisIndex: "analysis",
};

//
export type ListSectionName = BaseName<"allList">;

export const relNames = {
  ...baseNames,
  hasChild: hasChildSectionNames,
  hasParent: hasParentSectionNames,
  hasOneParent: hasOneParentSectionNames,
  isSingleParent: isSingleParentSectionNames,
  userListItem: userListItemNames,
  savable: savableSectionNames,
  savableAlwaysOne: savableSectionAlwaysOneNames,
  savableOneParent: savableSectionOneParentNames,
  hasDefaultStore: hasDefaultStoreNames,
  hasIndexStore: hasIndexStoreNames,
  hasRowIndexStore: hasRowIndexStoreNames,
  hasFullIndexStore: hasFullIndexStoreNames,
} as const;
