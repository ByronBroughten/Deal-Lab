import { NeversToSomething, SubType } from "../../utils/types";
import { SectionName, sectionNames } from "../SectionName";
import { ChildName } from "./ChildName";
import {
  childrenSectionNames,
  ChildSectionNameOrNull,
} from "./ChildSectionName";

export const noParentWarning = "no parent";

type ParentToChildOrNullMap<CN extends SectionName> = {
  [S in SectionName]: ChildSectionNameOrNull<S, CN>;
};
type ParentNameOrNever<SN extends SectionName> = keyof SubType<
  ParentToChildOrNullMap<SN>,
  SN
>;
function _testParentNameOrNever() {
  type Parent = ParentNameOrNever<"loan">;
  const _case1: Parent = "financing";
  //@ts-expect-error
  const _case3: Parent = "property";
}

type SectionToParentOrNever = {
  [SN in SectionName]: ParentNameOrNever<SN>;
};
export type SectionToParentNameArrs = {
  [SN in keyof SectionToParentOrNever]: SectionToParentOrNever[SN][];
};

type SectionNameArrs = Record<SectionName, SectionName[]>;
export function makeSectionToParentArrs(): SectionToParentNameArrs {
  const emptyArrs = sectionNames.reduce((parentNames, sectionName) => {
    parentNames[sectionName] = [];
    return parentNames;
  }, {} as SectionNameArrs);

  return sectionNames.reduce((parentNameArrs, sectionName) => {
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
export type ParentName<SN extends SectionName = SectionName> =
  SectionToParentOrNos[SN];
export type ParentNameSafe<SN extends SectionName> = Exclude<
  ParentName<SN>,
  typeof noParentWarning
>;

export type SelfChildName<
  SN extends SectionName,
  PN extends ParentNameSafe<SN> = ParentNameSafe<SN>
> = ChildName<PN>;

export type StepSiblingName<SN extends SectionName = SectionName> = ChildName<
  ParentNameSafe<SN>
>;
export type PiblingName<SN extends SectionName = SectionName> = StepSiblingName<
  ParentNameSafe<SN>
>;

function _testParentName() {
  type OneParentTest = ParentName<"property">;
  const _case1: OneParentTest = "deal";
  //@ts-expect-error
  const _case2: OneParentTest = "loan";

  type NoParentTest = ParentName<"root">;
  const _case3: NoParentTest = "no parent";
}
