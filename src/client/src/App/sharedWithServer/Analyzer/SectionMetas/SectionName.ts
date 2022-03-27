import { SectionContext, sectionContext } from "./relSections/baseSections";
import { SectionVarbName } from "./relSections/baseSectionTypes";
import { relNameArrs, RelNameArrs } from "./relNameArrs";
import {
  baseNameArrs,
  BaseNameArrs,
} from "./relSections/baseSectionTypes/baseNameArrs";

type NameArrs = {
  [SC in SectionContext]: BaseNameArrs[SC] & RelNameArrs[SC];
};
function makeNameArrs(): NameArrs {
  const partial = sectionContext.makeBlankObj();
  for (const contextName of sectionContext.names) {
    const nameArr = {
      ...baseNameArrs[contextName],
      ...relNameArrs[contextName],
    } as NameArrs[typeof contextName];
    partial[contextName] = nameArr;
  }
  return partial as NameArrs;
}

export type SectionNameType<SC extends SectionContext = SectionContext> =
  keyof NameArrs[SC];

export type FeSectionNameType = Exclude<SectionNameType<"fe">, "dbStore">;

export type SectionName<
  T extends SectionNameType<SC> = "all",
  SC extends SectionContext = "fe"
> = NameArrs[SC][T][number & keyof NameArrs[SC][T]];

export type AlwaysOneVarbFinder<
  S extends SectionName<"alwaysOne"> = SectionName<"alwaysOne">
> = {
  sectionName: S;
  varbName: SectionVarbName<"fe", S>;
};

export const SectionNam = {
  arrs: makeNameArrs(),
  is<T extends SectionNameType<SC> = "all", SC extends SectionContext = "fe">(
    value: any,
    type?: T,
    sectionContext?: SC
  ): value is SectionName<T, SC> {
    const names: any =
      this.arrs[sectionContext ?? ("fe" as SC)][type ?? ("all" as T)];
    return names.includes(value);
  },
};
