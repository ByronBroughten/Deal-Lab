import { isEqual } from "lodash";
import { Obj, ObjectKeys } from "../../../utils/Obj";
import { SubType } from "../../../utils/typescript";
import { dbSectionSchemas, baseSections } from "./baseSections";
import { FeNameInfo, SpecificSectionInfo } from "./rel/relVarbInfoTypes";
import { base } from "./baseSections/base";
import array from "../../../utils/Arr";

//
export type SectionFinder<S extends AllSectionName = AllSectionName> =
  | SpecificSectionInfo<S>
  | Extract<S, AlwaysOneSectionName>;

//
export type BaseSections = typeof baseSections;
type AllSectionName = keyof BaseSections;
const allSectionNames = ObjectKeys(baseSections);

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
type FeGuestAccessStoreSchema = SubType<BaseSections, { feGuestAccess: true }>;
type FeGuestAccessStoreName = keyof FeGuestAccessStoreSchema;
const feGuestAccessStoreNames = ObjectKeys(baseSections).filter(
  (sectionName) => baseSections[sectionName].feGuestAccess === true
) as FeGuestAccessStoreName[];

//
export type DbSectionSchemas = typeof dbSectionSchemas;
export type DbStoreName = keyof DbSectionSchemas;
export const dbStoreNames = ObjectKeys(dbSectionSchemas) as DbStoreName[];

//
type AlwaysOneSchemas = SubType<BaseSections, { alwaysOne: true }>;
type AlwaysOneSectionName = keyof AlwaysOneSchemas;
export const alwaysOneSectionNames = ObjectKeys(baseSections).filter(
  (sectionName) => {
    return baseSections[sectionName].alwaysOne;
  }
) as AlwaysOneSectionName[];
//
export const notAlwaysOneSectionNames = array.exclude(
  allSectionNames,
  alwaysOneSectionNames
);

//
type InitOnLoginSchema = SubType<BaseSections, { loadOnLogin: true }>;
type InitOnLoginSectionName = keyof InitOnLoginSchema;
const initOnLoginSectionNames = ObjectKeys(baseSections).filter(
  (sectionName) => {
    const schema = baseSections[sectionName];
    return "loadOnLogin" in schema && schema.loadOnLogin === true;
  }
) as InitOnLoginSectionName[];

//
type NoVarbsSectionSchema = SubType<
  BaseSections,
  { varbSchemas: { [K in any]: never } }
>;
type NoVarbsSectionName = keyof NoVarbsSectionSchema;
type HasVarbSectionSchemas = Omit<BaseSections, NoVarbsSectionName>;
type HasVarbSectionName = keyof HasVarbSectionSchemas;
const hasVarbSectionNames = ObjectKeys(baseSections).filter((sectionName) => {
  const varbNames = Object.keys(baseSections[sectionName].varbSchemas);
  return varbNames.length > 0;
}) as HasVarbSectionName[];

//
const alwaysOneHasVarbNames = array.extract(
  hasVarbSectionNames,
  alwaysOneSectionNames
);

//
const tableSectionNames = Obj.filterKeysForEntryShape(
  baseSections,
  base.section.table
);

const rowIndexSectionNames = Obj.filterKeysForEntryShape(
  baseSections,
  base.section.rowIndex
);

//
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
// function isSchemaFeInfo<T extends Exclude<SchemaNameTypes, "dbStore"> = "all">(
//   value: any,
//   type?: T
// ): value is FeNameInfo<BaseName<T>> {
//   return isBaseName(value.sectionName, type);
// }
