import { StringTypeChecker } from "../../utils/StringTypeChecker";
import { ContextName, sectionContext, SimpleSectionName } from "./baseSections";
import { AlwaysOneFinder, SectionVarbName } from "./baseSectionTypes";
import { baseNameArrs, BaseNameArrs } from "./baseSectionTypes/baseNameArrs";
import { relNameArrs, RelNameArrs } from "./relNameArrs";
import { SpecificSectionInfo } from "./relSections/rel/relVarbInfoTypes";

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

export type SectionNameType<SC extends ContextName = ContextName> =
  keyof NameArrs[SC];

export type FeSectionNameType = SectionNameType<"fe">;

export type SectionName<
  T extends SectionNameType<SC> = "all",
  SC extends ContextName = "fe"
> = NameArrs[SC][T][number & keyof NameArrs[SC][T]];

export type SectionFinderNext<T extends SectionNameType<"fe"> = "all"> =
  | SpecificSectionInfo<SectionName<T>>
  | AlwaysOneFinder<SectionName<T>>;

export type AlwaysOneVarbFinder<
  S extends SectionName<"alwaysOne"> = SectionName<"alwaysOne">
> = {
  sectionName: S;
  varbName: SectionVarbName<"fe", S>;
};

export const sectionNameS = new StringTypeChecker(makeNameArrs().fe);

type GeneralNameArrs = Record<
  SectionNameType<"fe">,
  readonly SimpleSectionName[]
>;
const _testNameArrs = <T extends GeneralNameArrs>(_: T) => undefined;
_testNameArrs(sectionNameS.arrs);
