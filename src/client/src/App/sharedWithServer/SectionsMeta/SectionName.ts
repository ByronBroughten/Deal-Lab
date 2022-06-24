import { StringTypeChecker } from "../../utils/StringTypeChecker";
import { ContextName, sectionContext, SimpleSectionName } from "./baseSections";
import { SectionVarbName } from "./baseSectionTypes";
import { baseNameArrs, BaseNameArrs } from "./baseSectionTypes/baseNameArrs";
import { relNameArrs, RelNameArrs } from "./relNameArrs";

type NameArrs = {
  [SC in ContextName]: BaseNameArrs[SC] & RelNameArrs[SC];
};
function makeNameArrs(): NameArrs {
  const partial = sectionContext.makeBlankContextObj();
  for (const contextName of sectionContext.names) {
    const nameArr = {
      ...baseNameArrs[contextName],
      ...relNameArrs[contextName],
    } as NameArrs[typeof contextName];
    partial[contextName] = nameArr;
  }
  return partial as NameArrs;
}

export type SectionNameType = keyof NameArrs["fe"];

export type FeSectionNameType = SectionNameType;

export type SectionName<T extends SectionNameType = "all"> =
  NameArrs["fe"][T][number & keyof NameArrs["fe"][T]];

export type AlwaysOneVarbFinder<
  S extends SectionName<"alwaysOne"> = SectionName<"alwaysOne">
> = {
  sectionName: S;
  varbName: SectionVarbName<"fe", S>;
};

export const sectionNameS = new StringTypeChecker(makeNameArrs().fe);

type GeneralNameArrs = Record<SectionNameType, readonly SimpleSectionName[]>;
const _testNameArrs = <T extends GeneralNameArrs>(_: T) => undefined;
_testNameArrs(sectionNameS.arrs);
