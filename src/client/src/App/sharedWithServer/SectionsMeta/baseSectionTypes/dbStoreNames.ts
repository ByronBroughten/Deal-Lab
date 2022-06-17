import { Arr } from "../../utils/Arr";
import { SimpleSectionName } from "../baseSections";

export const dbStoreNamesNext = [
  "user",
  "analysis",

  "propertyIndex",
  "loanIndex",
  "mgmtIndex",
  "dealIndex",

  "analysisTable",
  "propertyTable",
  "loanTable",
  "mgmtTable",

  "userOutputList",
  "userVarbList",
  "userSingleList",
  "userOngoingList",
] as const;

export type SimpleDbStoreName = typeof dbStoreNamesNext[number];
type TestDbStoreNames<DS extends readonly SimpleSectionName[]> = DS;
type _Test1 = TestDbStoreNames<typeof dbStoreNamesNext>;

type DbStoreNameCheck<DS extends SimpleDbStoreName> = DS;
export const feGuestAccessNames = Arr.exclude(dbStoreNamesNext, [
  // for now, this determines which sections the dbUser starts having populated.
  "user",
  "propertyIndex",
  "propertyIndex",
  "loanIndex",
  "mgmtIndex",
  "dealIndex",
] as const);

export const loadOnLoginNames = Arr.exclude(dbStoreNamesNext, [
  "propertyIndex",
  "loanIndex",
  "mgmtIndex",
  "dealIndex",
] as const);
type _LoadOnLoginTest = DbStoreNameCheck<typeof loadOnLoginNames[number]>;

export const dbStoreNamesDepreciated = [
  "user",

  "property",
  "loan",
  "mgmt",
  "analysis",

  "analysisTable",
  "propertyTable",
  "loanTable",
  "mgmtTable",

  "userOutputList",
  "userVarbList",
  "userSingleList",
  "userOngoingList",
] as const;

export type DbStoreName = typeof dbStoreNamesDepreciated[number];
