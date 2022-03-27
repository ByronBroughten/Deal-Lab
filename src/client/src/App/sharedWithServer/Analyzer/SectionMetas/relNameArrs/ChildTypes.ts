import { RemoveNotStrings } from "../../../utils/typescript";
import { RelSections } from "../relSections";
import { SectionContext, SimpleSectionName } from "../relSections/baseSections";
import { FeNameInfo } from "../relSections/rel/relVarbInfoTypes";

type ChildNameArr<
  SC extends SectionContext,
  SN extends SimpleSectionName<SC>
> = RelSections[SC][SN]["childSectionNames" & keyof RelSections[SC][SN]];

type SectionToChildrenOrNever<SC extends SectionContext> = {
  [SN in SimpleSectionName<SC>]: ChildNameArr<SC, SN>[number &
    keyof ChildNameArr<SC, SN>];
};

export type ChildName<
  S extends SimpleSectionName<SC>,
  SC extends SectionContext = "fe"
> = SectionToChildrenOrNever<SC>[S];

export type DescendantName<
  S extends SimpleSectionName<SC>,
  SC extends SectionContext
> = ChildName<S, SC> extends never
  ? never
  :
      | ChildName<S, SC>
      | DescendantName<ChildName<S, SC> & SimpleSectionName<SC>, SC>;
type _DescendantNameTest = DescendantName<"propertyGeneral", "fe">;
const _descendantNameTest1: _DescendantNameTest = "unit";
const _descendantNameTest2: _DescendantNameTest = "ongoingItem";
// @ts-expect-error
const _descendantNameTest3: _DescendantNameTest = "loan";

export type ChildIdArrs<
  SN extends SimpleSectionName<SC>,
  SC extends SectionContext = "fe"
> = Record<ChildName<SN, SC> & string, string[]>;

type SectionToChildren<SC extends SectionContext> = RemoveNotStrings<
  SectionToChildrenOrNever<SC>
>;

type Test = SectionToChildrenOrNever<"fe">;

export type ChildFeInfo<SN extends SimpleSectionName<"fe">> = FeNameInfo & {
  sectionName: ChildName<SN>;
  id: string;
};

export type HasChildSectionName<SC extends SectionContext> =
  keyof SectionToChildren<SC>;

export type ChildOrNull<
  SC extends SectionContext,
  SN extends SimpleSectionName<SC>,
  CN extends SimpleSectionName<SC>
> = Extract<
  ChildNameArr<SC, SN>[number & keyof ChildNameArr<SC, SN>],
  CN
> extends never
  ? null
  : CN;

// commented out on 3/25/22, for no apparent use
// type SectionToChildIdArrs<SC extends SectionContext> = {
//   [SN in keyof SectionToChildrenOrNever<SC>]: Record<
//     SectionToChildrenOrNever<SC>[SN] & string,
//     string[]
//   >;
// };
// type SectionToChildIdArrType<SC extends SectionContext> = {
//   [SN in keyof SectionToChildIdArrs<SC>]: SectionToChildIdArrs<SC>[SN][keyof SectionToChildIdArrs<SC>[SN]];
// };
// export type ChildIdArrType<SN extends SimpleSectionName<SC>, SC extends SectionContext> =
//   SectionToChildIdArrType<SC>[SN];
