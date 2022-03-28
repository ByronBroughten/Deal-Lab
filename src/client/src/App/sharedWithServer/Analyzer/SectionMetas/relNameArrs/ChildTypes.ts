import { RemoveNotStrings } from "../../../utils/typescript";
import StateSection from "../../StateSection";
import { RelSections } from "../relSections";
import { ContextName, SimpleSectionName } from "../relSections/baseSections";
import { FeNameInfo } from "../relSections/rel/relVarbInfoTypes";
import { SectionContextProps } from "../SectionName";

type ChildNameArr<
  SC extends ContextName,
  SN extends SimpleSectionName<SC>
> = RelSections[SC][SN]["childSectionNames" & keyof RelSections[SC][SN]];

type SectionToChildrenOrNever<SC extends ContextName> = {
  [SN in SimpleSectionName<SC>]: ChildNameArr<SC, SN>[number &
    keyof ChildNameArr<SC, SN>];
};

export type ChildName<
  SN extends SimpleSectionName,
  SC extends ContextName = "fe"
> = SectionToChildrenOrNever<SC>[SN];

export type DescendantName<SCP extends SectionContextProps> = ChildName<
  SCP["sectionName"],
  SCP["contextName"]
> extends never
  ? never
  :
      | ChildName<SCP["sectionName"], SCP["contextName"]>
      | DescendantName<{
          sectionName: ChildName<SCP["sectionName"], SCP["contextName"]> &
            SimpleSectionName;
          contextName: SCP["contextName"];
        }>;

export type DescendantIds<SCP extends SectionContextProps> = {
  [SN in DescendantName<SCP>]: string[];
};
export type DescendantSections<SCP extends SectionContextProps> = {
  [SN in DescendantName<SCP>]: StateSection<SN>[];
};

export type SectionAndDescendantName<SCP extends SectionContextProps> =
  | SCP["sectionName"]
  | DescendantName<SCP>;

function _testDescendantName() {
  type Props<CN extends ContextName> = {
    sectionName: "propertyGeneral";
    contextName: CN;
  };

  type FeTest = DescendantName<Props<"fe">>;
  type DbTest = DescendantName<Props<"db">>;

  const _test1: FeTest = "unit";
  const _test2: FeTest = "cell";
  // @ts-expect-error
  const _test3: FeTest = "loan";

  const _test4: DbTest = "unit";
  // @ts-expect-error
  const _teset5: DbTest = "cell";
}

export type ChildIdArrs<
  SN extends SimpleSectionName<SC>,
  SC extends ContextName = "fe"
> = Record<ChildName<SN, SC> & string, string[]>;

type SectionToChildren<SC extends ContextName> = RemoveNotStrings<
  SectionToChildrenOrNever<SC>
>;

type Test = SectionToChildrenOrNever<"fe">;

export type ChildFeInfo<SN extends SimpleSectionName<"fe">> = FeNameInfo & {
  sectionName: ChildName<SN>;
  id: string;
};

export type HasChildSectionName<SC extends ContextName> =
  keyof SectionToChildren<SC>;

export type ChildOrNull<
  SC extends ContextName,
  SN extends SimpleSectionName<SC>,
  CN extends SimpleSectionName<SC>
> = Extract<
  ChildNameArr<SC, SN>[number & keyof ChildNameArr<SC, SN>],
  CN
> extends never
  ? null
  : CN;

// commented out on 3/25/22, for no apparent use
// type SectionToChildIdArrs<SC extends ContextName> = {
//   [SN in keyof SectionToChildrenOrNever<SC>]: Record<
//     SectionToChildrenOrNever<SC>[SN] & string,
//     string[]
//   >;
// };
// type SectionToChildIdArrType<SC extends ContextName> = {
//   [SN in keyof SectionToChildIdArrs<SC>]: SectionToChildIdArrs<SC>[SN][keyof SectionToChildIdArrs<SC>[SN]];
// };
// export type ChildIdArrType<SN extends SimpleSectionName<SC>, SC extends ContextName> =
//   SectionToChildIdArrType<SC>[SN];
