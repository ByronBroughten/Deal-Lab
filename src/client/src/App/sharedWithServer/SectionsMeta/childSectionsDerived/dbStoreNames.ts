import { Arr } from "../../utils/Arr";
import { Obj } from "../../utils/Obj";
import { SimpleSectionName, simpleSectionNames } from "../baseSections";
import { childSections } from "../childSections";

// 1. edit the mongoose schema to add these storeNames.
// 2. add "mainStoreName" to the relSection of each of the sectionTypes
// 3. make addSection share code with updateSection
// 4. make new ordinary CRUD functions on the serverSide
// 5. make their req require both the storeName and the corresponding sectionPack

const dbStoreNamesNext = Obj.keys(childSections.dbStore);
export type DbStoreNameNext = typeof dbStoreNamesNext[number];

// these should be children of parent, now, rather than simpleSectionNames
export const dbStoreNames = Arr.extractStrict(simpleSectionNames, [
  "user",

  "deal",
  "property",
  "mgmt",
  "loan",

  "outputList",
  "userVarbList",
  "singleTimeList",
  "ongoingList",
] as const);

export type SimpleDbStoreName = typeof dbStoreNames[number];
type TestDbStoreNames<DS extends readonly SimpleSectionName[]> = DS;
type _Test1 = TestDbStoreNames<typeof dbStoreNames>;

type DbStoreNameCheck<DS extends SimpleDbStoreName> = DS;

export const feGuestAccessNames = Arr.extract(dbStoreNames, [
  // children of main that users should be able to play with and save
  // before making an account.
  "outputList",
  "userVarbList",
  "singleTimeList",
  "ongoingList",
] as const);

export const loadOnLoginNames = Arr.extractStrict(simpleSectionNames, [
  "feStore",
] as const);
