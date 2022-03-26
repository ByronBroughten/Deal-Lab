import { SectionContext } from "./relSections/baseSections";
import { SectionVarbName } from "./relSections/baseSectionTypes";
import { relNameArrs, RelNameArrs } from "./relSectionTypes";

export type SectionNameType<SC extends SectionContext = SectionContext> =
  keyof RelNameArrs[SC];
export type FeSectionNameType = Exclude<SectionNameType<"fe">, "dbStore">;

export type SectionName<
  T extends SectionNameType<SC> = "all",
  SC extends SectionContext = "fe"
> = RelNameArrs[SC][T][number & keyof RelNameArrs[SC][T]];

export type AlwaysOneVarbFinder<
  S extends SectionName<"alwaysOne"> = SectionName<"alwaysOne">
> = {
  sectionName: S;
  varbName: SectionVarbName<"fe", S>;
};

export const SectionNam = {
  arrs: relNameArrs,
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
