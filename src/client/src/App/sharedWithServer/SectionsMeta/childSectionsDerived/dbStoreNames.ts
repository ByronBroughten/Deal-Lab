import { Arr } from "../../utils/Arr";
import { Obj } from "../../utils/Obj";
import { simpleSectionNames } from "../baseSections";
import { childSections } from "../childSections";
import { ChildSectionName, ChildSectionNameName } from "./ChildSectionName";

// 1. edit the mongoose schema to add these storeNames.
// 2. add "mainStoreName" to the relSection of each of the sectionTypes
// 3. make addSection share code with updateSection
// 4. make new ordinary CRUD functions on the serverSide
// 5. make their req require both the storeName and the corresponding sectionPack

export const allDbStoreChildNames = Obj.keys(childSections.dbStore);
const serverOnlyNames = Arr.extractStrict(allDbStoreChildNames, [
  "serverOnlyUser",
] as const);

export const dbStoreNames = Arr.excludeStrict(
  allDbStoreChildNames,
  serverOnlyNames
);

export type DbStoreName = typeof dbStoreNames[number];
export type DbSectionName<CN extends DbStoreName = DbStoreName> =
  ChildSectionName<"dbStore", CN>;
export type DbSectionNameName<SN extends DbSectionName> = ChildSectionNameName<
  "dbStore",
  SN
>;
export interface DbStoreNameProp<CN extends DbStoreName = DbStoreName> {
  dbStoreName: CN;
}
export interface DbStoreInfo<CN extends DbStoreName = DbStoreName>
  extends DbStoreNameProp<CN> {
  dbId: string;
}

const feGuestAccessNames = Arr.extract(simpleSectionNames, [
  // children of main that users should be able to play with and save
  // before making an account.
  "outputList",
  "userVarbList",
  "singleTimeList",
  "ongoingList",
] as const);

const loadOnLoginNames = Arr.extractStrict(simpleSectionNames, [
  "feStore",
] as const);

export const dbSectionNameGroups = {
  loadOnLogin: loadOnLoginNames,
  feGuestAccess: feGuestAccessNames,
} as const;
