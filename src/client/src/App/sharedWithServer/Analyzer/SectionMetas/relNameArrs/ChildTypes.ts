import {
  RemoveNotStrings,
  StrictSubType,
  SubType,
} from "../../../utils/typescript";
import StateSection from "../../StateSection";
import { RelSections } from "../relSections";
import { ContextName, SimpleSectionName } from "../relSections/baseSections";
import { FeNameInfo } from "../relSections/rel/relVarbInfoTypes";
import { SectionContextProps } from "../SectionName";

type ChildNameArr<
  CN extends ContextName,
  SN extends SimpleSectionName<CN>
> = RelSections[CN][SN]["childSectionNames" & keyof RelSections[CN][SN]];

type SectionToChildrenOrNever<CN extends ContextName> = {
  [SN in SimpleSectionName]: ChildNameArr<CN, SN>[number &
    keyof ChildNameArr<CN, SN>];
};

type FeChildNameToDbSectionName<
  CHN extends ChildName<SimpleSectionName, "fe">
> = keyof StrictSubType<SectionToChildArr<"db">, [CHN]>;

type SectionToChildren<SC extends ContextName> = RemoveNotStrings<
  SectionToChildrenOrNever<SC>
>;
type SectionToChildArr<SC extends ContextName> = {
  [SN in keyof SectionToChildren<SC>]: [SectionToChildren<SC>[SN]];
};

export type FeToDbNameWithSameChildren<SN extends SimpleSectionName> =
  FeChildNameToDbSectionName<ChildName<SN>>;
const _testFeToDbNameWithSameChildren = (): void => {
  type TestName = FeToDbNameWithSameChildren<"property">;
  const _testName2: TestName = "property";
  const _testName1: TestName = "propertyIndex";
  // @ts-expect-error
  const _testName3: TestName = "mgmt";
};

export type ChildName<
  SN extends SimpleSectionName = SimpleSectionName,
  SC extends ContextName = "fe"
> = SectionToChildrenOrNever<SC>[SN];

export type DescendantName<
  SN extends SimpleSectionName,
  CN extends ContextName
> = ChildName<SN, CN> extends never
  ? never
  : ChildName<SN, CN> | DescendantName<ChildName<SN, CN>, CN>;

export type DescendantIds<
  SN extends SimpleSectionName,
  CN extends ContextName
> = {
  [S in DescendantName<SN, CN>]: string[];
};
export type DescendantSections<
  SN extends SimpleSectionName,
  CN extends ContextName
> = {
  [S in DescendantName<SN, CN>]: StateSection<S>[];
};

function _testDescendantName() {
  type SN = "propertyGeneral";

  type FeTest = DescendantName<SN, "fe">;
  type DbTest = DescendantName<SN, "db">;

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
