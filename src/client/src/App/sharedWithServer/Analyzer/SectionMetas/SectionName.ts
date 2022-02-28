import { NameVarbName } from "./relSections/baseNameArrs";
import { relNames } from "./relSectionTypes";

type SectionNameArrs = typeof relNames;
export type SectionNameType = keyof SectionNameArrs;
export type FeSectionNameType = Exclude<SectionNameType, "dbStore">;

export type SectionName<T extends SectionNameType = "all"> =
  typeof relNames[T][number];

export type AlwaysOneVarbFinder<
  S extends SectionName<"alwaysOne"> = SectionName<"alwaysOne">
> = {
  sectionName: S;
  varbName: NameVarbName<S>;
};

export const SectionNam = {
  arr: relNames,
  is<T extends SectionNameType = "all">(
    value: any,
    type?: T
  ): value is SectionName<T> {
    const names: readonly string[] = this.arr[type ?? "all"];
    return names.includes(value);
  },
};
