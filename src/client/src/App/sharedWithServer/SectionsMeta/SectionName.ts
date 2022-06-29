import { StringTypeChecker } from "../../utils/StringTypeChecker";
import { ContextName, sectionContext, SimpleSectionName } from "./baseSections";
import { baseNameArrs, BaseNameArrs } from "./baseSectionsDerived/baseNameArrs";
import { ParentName } from "./childSectionsDerived/ParentTypes";
import { relNameArrs, RelNameArrs } from "./relSectionsDerived/relNameArrs";

type NameArrs = {
  [SC in ContextName]: BaseNameArrs[SC] & RelNameArrs;
};
function makeNameArrs(): NameArrs {
  const partial = sectionContext.makeBlankContextObj();
  for (const contextName of sectionContext.names) {
    const nameArr = {
      ...baseNameArrs[contextName],
      ...relNameArrs,
    } as NameArrs[typeof contextName];
    partial[contextName] = nameArr;
  }
  return partial as NameArrs;
}

export type SectionNameType = keyof NameArrs["fe"];

export type SectionName<T extends SectionNameType = "all"> =
  NameArrs["fe"][T][number & keyof NameArrs["fe"][T]];

export const sectionNameS = new StringTypeChecker(makeNameArrs().fe);

type GeneralNameArrs = Record<SectionNameType, readonly SimpleSectionName[]>;
const _testNameArrs = <T extends GeneralNameArrs>(_: T) => undefined;
_testNameArrs(sectionNameS.arrs);

export type ParentOfTypeName<T extends SectionNameType = "all"> = ParentName<
  SectionName<T>
>;
