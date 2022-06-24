import {
  IsUnion,
  NeversToSomething,
  RemoveNotStrings,
  SubType,
} from "../../utils/types";
import { SimpleSectionName, simpleSectionNames } from "../baseSections";
import { BaseName } from "../baseSectionTypes";
import { relSections } from "../relSections";
import { FeNameInfo } from "../relSections/rel/relVarbInfoTypes";
import { ChildOrNull } from "./ChildTypes";

type ParentToChildOrNullMap<CN extends SimpleSectionName> = {
  [SN in SimpleSectionName]: ChildOrNull<SN, CN>;
};

type ParentNameOrNever<SN extends SimpleSectionName> = keyof SubType<
  ParentToChildOrNullMap<SN>,
  SN
>;
function _testParentNameOrNever() {
  type CellParent = ParentNameOrNever<"cell">;
  const _case1: CellParent = "tableRow";
  //@ts-expect-error
  const _case3: CellParent = "propertyGeneral";
}

type SectionToParentsOrNever = {
  [SN in SimpleSectionName]: ParentNameOrNever<SN>;
};

// this is for consistency in sectionMeta
export type SectionToParentNameArrs = {
  [SN in keyof SectionToParentsOrNever]: SectionToParentsOrNever[SN][];
};

type SectionToParents = RemoveNotStrings<SectionToParentsOrNever>;
type SectionToParentOrNos = NeversToSomething<
  SectionToParentsOrNever,
  "no parent"
>;

type SectionNameArrs = Record<SimpleSectionName, SimpleSectionName[]>;
export function makeSectionToParentArrs(): SectionToParentNameArrs {
  const emptyArrs = simpleSectionNames.reduce((parentNames, sectionName) => {
    parentNames[sectionName] = [];
    return parentNames;
  }, {} as SectionNameArrs);

  return simpleSectionNames.reduce((parentNameArrs, sectionName) => {
    for (const childName of relSections[sectionName].childNames) {
      parentNameArrs[childName].push(sectionName);
    }
    return parentNameArrs;
  }, emptyArrs) as SectionToParentNameArrs;
}
export const sectionParentNames = makeSectionToParentArrs();
export type HasParentSectionName = keyof SectionToParents;

export type ParentName<SN extends SimpleSectionName> = SectionToParentOrNos[SN];

export type ParentNameSafe<SN extends SimpleSectionName> = Exclude<
  ParentName<SN>,
  "no parent"
>;

function _testParentName() {
  type OneParent = ParentName<"property">;
  const _case1: OneParent = "propertyGeneral";
  //@ts-expect-error
  const _case2: OneParent = "financing";

  type NoParent = ParentName<"root">;
  const _case3: NoParent = "no parent";
}

export type ParentFeInfo<SN extends SimpleSectionName> = FeNameInfo<
  ParentName<SN>
>;

type SectionToOneParentOrNull = {
  [SN in keyof SectionToParents]: IsUnion<
    SectionToParentsOrNever[SN]
  > extends true
    ? null
    : SectionToParentsOrNever[SN] extends BaseName<"notAlwaysOne">
    ? null
    : SectionToParentsOrNever[SN];
};
type SectionToAlwaysOneParent = SubType<SectionToOneParentOrNull, string>;
export type HasOneParentSectionName = keyof SectionToAlwaysOneParent;

export type IsSingleParentName =
  SectionToAlwaysOneParent[HasOneParentSectionName];
