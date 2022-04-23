import { Obj } from "../../utils/Obj";
import {
  IsUnion,
  NeversToSomething,
  RemoveNotStrings,
  SubType,
} from "../../utils/types";
import {
  ContextName,
  sectionContext,
  SimpleSectionName,
} from "../baseSections";
import { BaseName, SectionFinder } from "../baseSectionTypes";
import { relSections } from "../relSections";
import { FeSectionInfoBase } from "../relSections/rel/relVarbInfoTypes";
import { ChildOrNull } from "./ChildTypes";

type ParentToChildOrNullMap<
  SC extends ContextName,
  CN extends SimpleSectionName<SC>
> = {
  [SN in SimpleSectionName<SC>]: ChildOrNull<SC, SN, CN>;
};

type ParentNameOrNever<
  SC extends ContextName,
  SN extends SimpleSectionName<SC>
> = keyof SubType<ParentToChildOrNullMap<SC, SN>, SN>;
function _testParentNameOrNever() {
  type CellParent = ParentNameOrNever<"fe", "cell">;
  const _case1: CellParent = "propertyIndex";
  const _case2: CellParent = "loanIndex";
  //@ts-expect-error
  const _case3: CellParent = "propertyGeneral";
}

type SectionToParentsOrNever<SC extends ContextName> = {
  [SN in SimpleSectionName<SC>]: ParentNameOrNever<SC, SN>;
};

// this is for consistency in sectionMeta
export type SectionToParentArrs<SC extends ContextName> = {
  [SN in keyof SectionToParentsOrNever<SC>]: SectionToParentsOrNever<SC>[SN][];
};

type SectionToParents<SC extends ContextName> = RemoveNotStrings<
  SectionToParentsOrNever<SC>
>;
type SectionToParentOrNos<SC extends ContextName> = NeversToSomething<
  SectionToParentsOrNever<SC>,
  "no parent"
>;

type ContextSectionToParentArrs = {
  [SC in ContextName]: SectionToParentArrs<SC>;
};
export function makeSectionToParentArrs(): ContextSectionToParentArrs {
  const partial = sectionContext.makeBlankContextObj();
  for (const contextName of sectionContext.names) {
    type AllParents = Record<SimpleSectionName, SimpleSectionName[]>;
    const sectionToParentArrs = Obj.keys(relSections[contextName]).reduce(
      (parents, key) => {
        parents[key as keyof typeof parents] = [];
        return parents;
      },
      {} as AllParents
    ) as AllParents;

    for (const sectionName of Obj.keys(relSections[contextName])) {
      for (const childName of relSections[contextName][sectionName]
        .childNames) {
        sectionToParentArrs[childName as keyof typeof sectionToParentArrs].push(
          sectionName
        );
      }
    }
    partial[contextName] = sectionToParentArrs;
  }
  return partial as ContextSectionToParentArrs;
}

export type HasParentSectionName<SC extends ContextName> =
  keyof SectionToParents<SC>;

export type ParentName<
  SN extends SimpleSectionName<SC>,
  SC extends ContextName = "fe"
> = SectionToParentOrNos<SC>[SN];

function _testParentName() {
  type OneParent = ParentName<"property", "fe">;
  const _case1: OneParent = "propertyGeneral";
  //@ts-expect-error
  const _case2: OneParent = "financing";

  type NoParent = ParentName<"main", "fe">;
  const _case3: NoParent = "no parent";
}

export type FeParentInfo<
  SN extends SimpleSectionName<SC>,
  SC extends ContextName = "fe"
> = FeSectionInfoBase & {
  sectionName: ParentName<SN, SC>;
};

type HasOneParentFinder<
  SN extends SimpleSectionName,
  CN extends ContextName
> = Extract<SN, HasOneParentSectionName<CN>>;

export type ParentFinder<
  SN extends SimpleSectionName<SC>,
  SC extends ContextName = "fe"
> =
  | FeParentInfo<SN, SC>
  | ParentName<Extract<SN, HasOneParentSectionName<SC>>, SC>;

export type SectionParentFinder<
  SN extends SimpleSectionName,
  CN extends ContextName = "fe"
> = SectionFinder<SN> | HasOneParentFinder<SN, CN>;

type SectionToOneParentOrNull<SC extends ContextName> = {
  [SN in keyof SectionToParents<SC>]: IsUnion<
    SectionToParentsOrNever<SC>[SN]
  > extends true
    ? null
    : SectionToParentsOrNever<SC>[SN] extends BaseName<"notAlwaysOne">
    ? null
    : SectionToParentsOrNever<SC>[SN];
};
type SectionToAlwaysOneParent<SC extends ContextName> = SubType<
  SectionToOneParentOrNull<SC>,
  string
>;
export type HasOneParentSectionName<SC extends ContextName> =
  keyof SectionToAlwaysOneParent<SC>;

export function makeParentSectionNames<SC extends ContextName>(
  sectionContext: SC
) {
  const sectionToParentArrs = makeSectionToParentArrs()[sectionContext];
  const hasParentSectionNames = Obj.keys(sectionToParentArrs).filter(
    (sectionName) =>
      sectionToParentArrs[sectionName as SimpleSectionName].length > 0
  ) as HasParentSectionName<SC>[];

  return {
    hasParent: hasParentSectionNames,
  };
}

export type IsSingleParentName<SC extends ContextName> =
  SectionToAlwaysOneParent<SC>[HasOneParentSectionName<SC>];
