import { SubType } from "../utils/types";
import {
  BaseSections,
  baseSections,
  ContextName,
  SimpleSectionName,
} from "./baseSections";
import { ValueName } from "./baseSections/baseVarb";
import {
  baseNameArrs,
  BaseNameArrs,
  BaseNameSelector,
} from "./baseSectionTypes/baseNameArrs";
import { SpecificSectionInfo } from "./relSections/rel/relVarbInfoTypes";

export type BaseName<
  ST extends BaseNameSelector<SC> = "all",
  SC extends ContextName = "fe",
  NameArrs = BaseNameArrs[SC][ST]
> = NameArrs[number & keyof NameArrs];

export type AlwaysOneFinder<S extends BaseName> = Extract<
  S,
  BaseName<"alwaysOne">
>;
//
export type SectionFinder<S extends SimpleSectionName = SimpleSectionName> =
  | SpecificSectionInfo<S>
  | AlwaysOneFinder<S>;

type BaseSectionVarbs<
  SC extends ContextName,
  SN extends SimpleSectionName<SC>,
  BaseSection = BaseSections[SC][SN]
> = BaseSection["varbSchemas" & keyof BaseSection];

export type SectionVarbName<
  SC extends ContextName,
  SN extends SimpleSectionName<SC>
> = keyof BaseSectionVarbs<SC, SN>;

export type SectionVarbNameByType<
  SC extends ContextName,
  SN extends SimpleSectionName<SC>,
  VLN extends ValueName
> = keyof SubType<BaseSectionVarbs<SC, SN>, VLN>;

//
export type BaseSectionsDb = typeof baseSections.db;

export function listNameToStoreName(sectionName: BaseName<"allList">) {
  if (isBaseName(sectionName, "singleTimeList")) return "userSingleList";
  if (isBaseName(sectionName, "ongoingList")) return "userOngoingList";
  else if (sectionName === "userVarbList") return "userVarbList";
  else throw new Error("A list sectionName was not provided");
}

export function isBaseName<T extends BaseNameSelector = "all">(
  value: any,
  type?: T
): value is BaseName<T> {
  const names: readonly string[] = baseNameArrs["fe"][type ?? "all"];
  return names.includes(value);
}
