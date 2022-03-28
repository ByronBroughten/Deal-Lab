import {
  ContextName,
  sectionContext,
  SimpleSectionName,
} from "./relSections/baseSections";
import { SectionVarbName } from "./relSections/baseSectionTypes";
import { relNameArrs, RelNameArrs } from "./relNameArrs";
import {
  baseNameArrs,
  BaseNameArrs,
} from "./relSections/baseSectionTypes/baseNameArrs";
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

export type FeSectionNameType = Exclude<SectionNameType<"fe">, "dbStore">;

export type SectionName<
  T extends SectionNameType<SC> = "all",
  SC extends ContextName = "fe"
> = NameArrs[SC][T][number & keyof NameArrs[SC][T]];

export type NextSectionFinder<S extends SectionName = SectionName> =
  | SpecificSectionInfo<S>
  | Extract<S, SectionName<"alwaysOne">>;

export type SectionContextProps<
  SN extends SectionName = SectionName,
  CN extends ContextName = ContextName
> = {
  sectionName: SN;
  contextName: CN;
};

export type AlwaysOneVarbFinder<
  S extends SectionName<"alwaysOne"> = SectionName<"alwaysOne">
> = {
  sectionName: S;
  varbName: SectionVarbName<"fe", S>;
};

export const SectionNam = {
  arrs: makeNameArrs(),
  is<T extends SectionNameType<SC> = "all", SC extends ContextName = "fe">(
    value: any,
    type?: T,
    sectionContext?: SC
  ): value is SectionName<T, SC> {
    const names: any =
      this.arrs[sectionContext ?? ("fe" as SC)][type ?? ("all" as T)];
    return names.includes(value);
  },
};

type GeneralNameArrs = {
  [SC in ContextName]: Record<
    SectionNameType<"fe">,
    readonly SimpleSectionName[]
  >;
};
const _testNameArrs = <T extends GeneralNameArrs>(_: T) => undefined;
_testNameArrs(SectionNam.arrs);
