import { NeversToSomething, SubType } from "../../utils/types";
import { SimpleSectionName, simpleSectionNames } from "../baseSections";
import { noParentWarning } from "../Info";
import {
  childrenSectionNames,
  ChildSectionNameOrNull,
} from "./ChildSectionName";

// listParent
// the name of a section that is the parent of singleTimeList
// the name of a section that is the parent of allList

type ParentToChildOrNullMap<CN extends SimpleSectionName> = {
  [S in SimpleSectionName]: ChildSectionNameOrNull<S, CN>;
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

type SectionToParentOrNever = {
  [SN in SimpleSectionName]: ParentNameOrNever<SN>;
};
export type SectionToParentNameArrs = {
  [SN in keyof SectionToParentOrNever]: SectionToParentOrNever[SN][];
};

type SectionNameArrs = Record<SimpleSectionName, SimpleSectionName[]>;
export function makeSectionToParentArrs(): SectionToParentNameArrs {
  const emptyArrs = simpleSectionNames.reduce((parentNames, sectionName) => {
    parentNames[sectionName] = [];
    return parentNames;
  }, {} as SectionNameArrs);

  return simpleSectionNames.reduce((parentNameArrs, sectionName) => {
    for (const childType of childrenSectionNames[sectionName]) {
      parentNameArrs[childType].push(sectionName);
    }
    return parentNameArrs;
  }, emptyArrs) as SectionToParentNameArrs;
}
export const sectionParentNames = makeSectionToParentArrs();

type SectionToParentOrNos = NeversToSomething<
  SectionToParentOrNever,
  typeof noParentWarning
>;
export type ParentName<SN extends SimpleSectionName> = SectionToParentOrNos[SN];
export type ParentNameSafe<SN extends SimpleSectionName> = Exclude<
  ParentName<SN>,
  typeof noParentWarning
>;

function _testParentName() {
  type OneParent = ParentName<"property">;
  const _case1: OneParent = "propertyGeneral";
  //@ts-expect-error
  const _case2: OneParent = "financing";

  type NoParent = ParentName<"root">;
  const _case3: NoParent = "no parent";
}
