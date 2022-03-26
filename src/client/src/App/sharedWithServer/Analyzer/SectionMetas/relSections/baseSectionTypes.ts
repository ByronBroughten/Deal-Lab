import { SubType } from "../../../utils/typescript";
import {
  BaseSections,
  baseSections,
  SectionContext,
  SimpleSectionName,
} from "./baseSections";
import { SpecificSectionInfo } from "./rel/relVarbInfoTypes";
import {
  baseNameArrs,
  BaseNameArrs,
  BaseNameSelector,
  depreciatingDbStoreNames,
} from "./baseSectionTypes/baseNameArrs";
import { ValueName } from "./baseSections/baseVarb";

export type BaseName<
  ST extends BaseNameSelector<SC> = "all",
  SC extends SectionContext = "fe",
  NameArrs = BaseNameArrs[SC][ST]
> = NameArrs[number & keyof NameArrs];

//
export type SectionFinder<
  S extends SimpleSectionName = SimpleSectionName<"fe">
> = SpecificSectionInfo<S> | Extract<S, BaseName<"alwaysOne", "fe">>;

type BaseSectionVarbs<
  SC extends SectionContext,
  SN extends SimpleSectionName<SC>,
  BaseSection = BaseSections[SC][SN]
> = BaseSection["varbSchemas" & keyof BaseSection];

export type SectionVarbName<
  SC extends SectionContext,
  SN extends SimpleSectionName<SC>
> = keyof BaseSectionVarbs<SC, SN>;

export type SectionVarbNameByType<
  SC extends SectionContext,
  SN extends SimpleSectionName<SC>,
  VLN extends ValueName
> = keyof SubType<BaseSectionVarbs<SC, SN>, VLN>;

//
export type DbSectionSchemas = typeof baseSections.db;
export type DbStoreName = typeof depreciatingDbStoreNames[number];
export const dbStoreNames = depreciatingDbStoreNames;

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
