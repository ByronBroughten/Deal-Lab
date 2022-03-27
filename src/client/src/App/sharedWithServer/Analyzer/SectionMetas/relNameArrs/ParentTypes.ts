import { Obj } from "../../../utils/Obj";
import {
  IsUnion,
  NeversToSomething,
  RemoveNotStrings,
  SubType,
} from "../../../utils/typescript";
import { relSections } from "../relSections";
import {
  SectionContext,
  sectionContext,
  SimpleSectionName,
} from "../relSections/baseSections";
import { BaseName } from "../relSections/baseSectionTypes";
import { GeneralRelSection } from "../relSections/rel/relSection";
import { FeSectionInfoBase } from "../relSections/rel/relVarbInfoTypes";
import { ChildOrNull } from "./ChildTypes";

type ParentToChildOrNullMap<
  SC extends SectionContext,
  CN extends SimpleSectionName<SC>
> = {
  [SN in SimpleSectionName<SC>]: ChildOrNull<SC, SN, CN>;
};

type ParentNameOrNever<
  SC extends SectionContext,
  SN extends SimpleSectionName<SC>
> = keyof SubType<ParentToChildOrNullMap<SC, SN>, SN>;
function _testParentNameOrNever() {
  type CellParent = ParentNameOrNever<"fe", "cell">;
  const _case1: CellParent = "propertyIndex";
  const _case2: CellParent = "loanIndex";
  //@ts-expect-error
  const _case3: CellParent = "propertyGeneral";
}

type SectionToParentsOrNever<SC extends SectionContext> = {
  [SN in SimpleSectionName<SC>]: ParentNameOrNever<SC, SN>;
};

// this is for consistency in sectionMeta
export type SectionToParentArrs<SC extends SectionContext> = {
  [SN in keyof SectionToParentsOrNever<SC>]: SectionToParentsOrNever<SC>[SN][];
};

type SectionToParents<SC extends SectionContext> = RemoveNotStrings<
  SectionToParentsOrNever<SC>
>;
type SectionToParentOrNos<SC extends SectionContext> = NeversToSomething<
  SectionToParentsOrNever<SC>,
  "no parent"
>;

type ContextSectionToParentArrs = {
  [SC in SectionContext]: SectionToParentArrs<SC>;
};
export function makeSectionToParentArrs(): ContextSectionToParentArrs {
  const partial = sectionContext.makeBlankObj();
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
        .childSectionNames) {
        sectionToParentArrs[childName as keyof typeof sectionToParentArrs].push(
          sectionName
        );
      }
    }
    partial[contextName] = sectionToParentArrs;
  }
  return partial as ContextSectionToParentArrs;
}

export type HasParentSectionName<SC extends SectionContext> =
  keyof SectionToParents<SC>;

export type ParentName<
  SN extends SimpleSectionName<SC>,
  SC extends SectionContext = "fe"
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
  SC extends SectionContext = "fe"
> = FeSectionInfoBase & {
  sectionName: ParentName<SN, SC>;
};
export type ParentFinder<
  SN extends SimpleSectionName<SC>,
  SC extends SectionContext = "fe"
> =
  | FeParentInfo<SN, SC>
  | ParentName<Extract<SN, HasOneParentSectionName<SC>>, SC>;

type SectionToOneParentOrNull<SC extends SectionContext> = {
  [SN in keyof SectionToParents<SC>]: IsUnion<
    SectionToParentsOrNever<SC>[SN]
  > extends true
    ? null
    : SectionToParentsOrNever<SC>[SN] extends BaseName<"notAlwaysOne">
    ? null
    : SectionToParentsOrNever<SC>[SN];
};
type SectionToAlwaysOneParent<SC extends SectionContext> = SubType<
  SectionToOneParentOrNull<SC>,
  string
>;
export type HasOneParentSectionName<SC extends SectionContext> =
  keyof SectionToAlwaysOneParent<SC>;

export function makeParentSectionNames<SC extends SectionContext>(
  sectionContext: SC
) {
  const sectionToParentArrs = makeSectionToParentArrs()[sectionContext];
  sectionToParentArrs.property;

  const hasParentSectionNames = Obj.keys(sectionToParentArrs).filter(
    (sectionName) =>
      sectionToParentArrs[sectionName as SimpleSectionName].length > 0
  ) as HasParentSectionName<SC>[];

  return {
    hasParent: hasParentSectionNames,
  };
}

export type IsSingleParentName<SC extends SectionContext> =
  SectionToAlwaysOneParent<SC>[HasOneParentSectionName<SC>];
