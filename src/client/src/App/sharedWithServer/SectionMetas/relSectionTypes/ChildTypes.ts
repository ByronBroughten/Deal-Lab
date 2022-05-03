import StateSection from "../../Analyzer/StateSection";
import { RemoveNotStrings, StrictSubType, SubType } from "../../utils/types";
import { ContextName, SimpleSectionName } from "../baseSections";
import { DbStoreNameNext, DbStoreTypeNext } from "../relNameArrs/storeArrs";
import { RelSections } from "../relSections";
import { FeNameInfo } from "../relSections/rel/relVarbInfoTypes";

type ChildNameArr<
  CN extends ContextName,
  SN extends SimpleSectionName<CN>
> = RelSections[CN][SN]["childNames" & keyof RelSections[CN][SN]];

type SectionToChildrenOrNever<CN extends ContextName> = {
  [SN in SimpleSectionName]: ChildNameArr<CN, SN>[number &
    keyof ChildNameArr<CN, SN>];
};

type SectionToChildren<SC extends ContextName> = RemoveNotStrings<
  SectionToChildrenOrNever<SC>
>;
type SectionToChildArr<SC extends ContextName> = {
  [SN in keyof SectionToChildren<SC>]: [SectionToChildren<SC>[SN]];
};

export type SectionNameWithSameChildren<
  SN extends SimpleSectionName,
  FromCN extends ContextName,
  ToCN extends ContextName
> = ChildToSectionWithChildName<FromCN, ToCN, ChildName<SN>>;

export type SectionNameWithSameChildrenWide<
  SN extends SimpleSectionName,
  FromCN extends ContextName,
  ToCN extends ContextName
> = ChildToSectionWithChildWide<FromCN, ToCN, ChildName<SN>>;

export type FeToDbNameWithSameChildren<SN extends SimpleSectionName> =
  SectionNameWithSameChildren<SN, "fe", "db">;

export type FeToDbStoreNameWithSameChildren<
  SN extends SimpleSectionName,
  DT extends DbStoreTypeNext = "all"
> = Extract<FeToDbNameWithSameChildren<SN>, DbStoreNameNext<DT>>;

export type DbToFeNameWithSameChildren<SN extends SimpleSectionName> =
  SectionNameWithSameChildren<SN, "db", "fe">;

type ChildToSectionWithChildName<
  FromCN extends ContextName,
  ToCN extends ContextName,
  CHN extends ChildName<SimpleSectionName, FromCN>
> = keyof StrictSubType<SectionToChildArr<ToCN>, [CHN]>;

type ChildToSectionWithChildWide<
  FromCN extends ContextName,
  ToCN extends ContextName,
  CHN extends ChildName<SimpleSectionName, FromCN>
> = keyof SubType<SectionToChildArr<ToCN>, [CHN]>;

const _testFeToDbNameWithSameChildren = (): void => {
  type TestName = FeToDbNameWithSameChildren<"property">;
  const _testName2: TestName = "property";
  const _testName1: TestName = "propertyIndexNext";
  // @ts-expect-error
  const _testName3: TestName = "mgmt";
};

export type ChildName<
  SN extends SimpleSectionName = SimpleSectionName,
  SC extends ContextName = "fe"
> = SectionToChildrenOrNever<SC>[SN];

export type DescendantName<
  SN extends SimpleSectionName,
  CN extends ContextName = "fe"
> = ChildName<SN, CN> extends never
  ? never
  : ChildName<SN, CN> | DescendantName<ChildName<SN, CN>, CN>;

export type SelfOrDescendantName<
  SN extends SimpleSectionName,
  CN extends ContextName = "fe"
> = SN | DescendantName<SN, CN>;

export type DescendantIds<
  SN extends SimpleSectionName,
  CN extends ContextName
> = {
  [S in DescendantName<SN, CN>]: string[];
};

export type SelfOrDescendantIds<
  SN extends SimpleSectionName = SimpleSectionName,
  CN extends ContextName = ContextName
> = {
  [S in SelfOrDescendantName<SN, CN>]: string[];
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

export type GeneralChildIdArrs = {
  [key: string]: string[];
};
export type OneChildIdArrs<
  SN extends SimpleSectionName,
  CN extends ContextName
> = {
  [CHN in ChildName<SN, CN>]: string[];
};

export type ChildIdArrs<
  SN extends SimpleSectionName<CN>,
  CN extends ContextName = "fe"
> = {
  [CHN in ChildName<SN, CN>]: string[];
};

export interface ChildFeInfo<SN extends SimpleSectionName<"fe">>
  extends FeNameInfo {
  sectionName: ChildName<SN>;
}

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
