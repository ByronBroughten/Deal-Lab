import { NeversToSomething, SubType } from "../../utils/types";
import { SimpleSectionName, simpleSectionNames } from "../baseSections";
import { ChildTypeOrNull, sectionToChildTypes } from "./ChildTypes";

type ParentToChildOrNullMap<CN extends SimpleSectionName> = {
  [S in SimpleSectionName]: ChildTypeOrNull<S, CN>;
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
export type SectionToParentNameArrs = {
  [SN in keyof SectionToParentsOrNever]: SectionToParentsOrNever[SN][];
};

type SectionNameArrs = Record<SimpleSectionName, SimpleSectionName[]>;
export function makeSectionToParentArrs(): SectionToParentNameArrs {
  const emptyArrs = simpleSectionNames.reduce((parentNames, sectionName) => {
    parentNames[sectionName] = [];
    return parentNames;
  }, {} as SectionNameArrs);

  return simpleSectionNames.reduce((parentNameArrs, sectionName) => {
    for (const childType of sectionToChildTypes[sectionName]) {
      parentNameArrs[childType].push(sectionName);
    }
    return parentNameArrs;
  }, emptyArrs) as SectionToParentNameArrs;
}
export const sectionParentNames = makeSectionToParentArrs();

type SectionToParentOrNos = NeversToSomething<
  SectionToParentsOrNever,
  "no parent"
>;
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
