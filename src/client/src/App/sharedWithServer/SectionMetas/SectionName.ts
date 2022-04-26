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

export type SectionNameType<SC extends ContextName = ContextName> =
  keyof NameArrs[SC];

export type FeSectionNameType = SectionNameType<"fe">;

export type SectionName<
  T extends SectionNameType<SC> = "all",
  SC extends ContextName = "fe"
> = NameArrs[SC][T][number & keyof NameArrs[SC][T]];

export type AlwaysOneVarbFinder<
  S extends SectionName<"alwaysOne"> = SectionName<"alwaysOne">
> = {
  sectionName: S;
  varbName: SectionVarbName<"fe", S>;
};

export const sectionNameS = {
  arrs: makeNameArrs(),
  is<T extends SectionNameType<SC> = "all", SC extends ContextName = "fe">(
    value: any,
    type?: T,
    sectionContext?: SC
  ): value is SectionName<T, SC> {
    const names: any =
      this.arrs[(sectionContext ?? "fe") as SC][(type ?? "all") as T];
    return names.includes(value);
  },
} as const;

type GeneralNameArrs = {
  [SC in ContextName]: Record<
    SectionNameType<"fe">,
    readonly SimpleSectionName[]
  >;
};
const _testNameArrs = <T extends GeneralNameArrs>(_: T) => undefined;
_testNameArrs(sectionNameS.arrs);
