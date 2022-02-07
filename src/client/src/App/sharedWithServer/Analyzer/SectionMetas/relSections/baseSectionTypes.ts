import { isEqual } from "lodash";
import { Obj } from "../../../utils/Obj";
import { SubType } from "../../../utils/typescript";
import { dbSectionSchemas, baseSections } from "./baseSections";
import { SpecificSectionInfo } from "./rel/relVarbInfoTypes";
import { base } from "./baseSections/base";
import array from "../../../utils/Arr";

//
export type SectionFinder<S extends AllSectionName = AllSectionName> =
  | SpecificSectionInfo<S>
  | Extract<S, AlwaysOneSectionName>;
type AlwaysOneSectionName = typeof alwaysOneSectionNames[number];

//
export type BaseSections = typeof baseSections;
type AllSectionName = keyof BaseSections;
const allSectionNames = Obj.keys(baseSections);

// to deal with just varb shapes, you can transform baseSections and

const baseSectionVarbs = Obj.toNestedPropertyObj(baseSections, "varbSchemas");

export type VarbName<S extends AllSectionName> =
  keyof BaseSections[S]["varbSchemas"];

type SectionVarbSchemas<S extends AllSectionName> =
  BaseSections[S]["varbSchemas"];
type NumObjVarbSchemas<S extends AllSectionName> = SubType<
  SectionVarbSchemas<S>,
  "numObj"
>;
type StringVarbSchemas<S extends AllSectionName> = SubType<
  SectionVarbSchemas<S>,
  "string"
>;

export type StringVarbName<S extends AllSectionName> =
  keyof StringVarbSchemas<S>;
export type NumObjVarbName<S extends AllSectionName> =
  keyof NumObjVarbSchemas<S>;

//
const feGuestAccessStoreNames = Obj.entryKeysWithPropValue(
  baseSections,
  "feGuestAccess",
  true as true
);

//
export type DbSectionSchemas = typeof dbSectionSchemas;
export type DbStoreName = keyof DbSectionSchemas;
export const dbStoreNames = Obj.keys(dbSectionSchemas) as DbStoreName[];

export const alwaysOneSectionNames = Obj.entryKeysWithPropValue(
  baseSections,
  "alwaysOne",
  true as true
);
export const notAlwaysOneSectionNames = array.exclude(
  allSectionNames,
  alwaysOneSectionNames
);
const initOnLoginSectionNames = Obj.entryKeysWithPropValue(
  baseSections,
  "loadOnLogin",
  true as true
);
const hasGlobalVarbNames = Obj.entryKeysWithPropValue(
  baseSections,
  "hasGlobalVarbs",
  true as true
);

//
type NoVarbsSectionSchema = SubType<
  BaseSections,
  { varbSchemas: { [K in any]: never } }
>;
type NoVarbsSectionName = keyof NoVarbsSectionSchema;
type HasVarbSectionSchemas = Omit<BaseSections, NoVarbsSectionName>;
type HasVarbSectionName = keyof HasVarbSectionSchemas;
const hasVarbSectionNames = Obj.keys(baseSections).filter((sectionName) => {
  const varbNames = Object.keys(baseSections[sectionName].varbSchemas);
  return varbNames.length > 0;
}) as HasVarbSectionName[];

//
const alwaysOneHasVarbNames = array.extract(
  hasVarbSectionNames,
  alwaysOneSectionNames
);

const tableSectionNames = Obj.filterKeysForEntryShape(
  baseSections,
  base.section.table
);

const rowIndexSectionNames = Obj.filterKeysForEntryShape(
  baseSections,
  base.section.rowIndex
);

const userListSectionNames = array.extract(allSectionNames, [
  "userSingleList",
  "userOngoingList",
  "userVarbList",
] as const);

const singleTimeListNames = Obj.filterKeysForEntryShape(
  baseSectionVarbs,
  baseSectionVarbs.userSingleList
);
const ongoingListNames = Obj.filterKeysForEntryShape(
  baseSectionVarbs,
  baseSectionVarbs.userOngoingList
);
// it would probably be safer to go by whether they have
// the same child item, rather than the same varb shape.
// In which case this should be in relSectionTypes instead

export function listNameToStoreName(sectionName: BaseName<"allList">) {
  if (isBaseName(sectionName, "singleTimeList")) return "userSingleList";
  if (isBaseName(sectionName, "ongoingList")) return "userOngoingList";
  else if (sectionName === "userVarbList") return "userVarbList";
  else throw new Error("A list sectionName was not provided");
}

const allListSectionNames = [
  ...singleTimeListNames,
  ...ongoingListNames,
  "userVarbList",
] as const;

const additiveListSectionTypes = array.extract(userListSectionNames, [
  "userSingleList",
  "userOngoingList",
] as const);

export const baseNames = {
  all: allSectionNames,
  table: tableSectionNames,
  feGuestAccessStore: feGuestAccessStoreNames,
  dbStore: dbStoreNames,
  alwaysOne: alwaysOneSectionNames,
  notAlwaysOne: notAlwaysOneSectionNames,
  initOnLogin: initOnLoginSectionNames,
  hasVarb: hasVarbSectionNames,
  alwaysOneHasVarb: alwaysOneHasVarbNames,
  userList: userListSectionNames,
  feSaved: userListSectionNames,
  singleTimeList: singleTimeListNames,
  ongoingList: ongoingListNames,
  allList: allListSectionNames,
  additiveListType: additiveListSectionTypes,
  rowIndex: rowIndexSectionNames,
  hasGlobalVarbs: hasGlobalVarbNames,
} as const;

type SchemaNameArrs = typeof baseNames;
type SchemaNameTypes = keyof SchemaNameArrs;
export type BaseName<T extends SchemaNameTypes = "all"> =
  typeof baseNames[T][number];

export function isBaseName<T extends SchemaNameTypes = "all">(
  value: any,
  type?: T
): value is BaseName<T> {
  const names: readonly string[] = baseNames[type ?? "all"];
  return names.includes(value);
}
