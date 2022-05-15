import { Arr } from "../../utils/Arr";
import { SimpleSectionName } from "../baseSections";

export const dbStoreNamesNext = [
  "user",
  "analysis",

  "propertyIndexNext",
  "loanIndexNext",
  "mgmtIndexNext",
  "analysisIndexNext",

  "analysisTableNext",
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
  "propertyIndexNext",
  "propertyIndexNext",
  "loanIndexNext",
  "mgmtIndexNext",
  "analysisIndexNext",
] as const);

export const loadOnLoginNames = Arr.exclude(dbStoreNamesNext, [
  "propertyIndexNext",
  "loanIndexNext",
  "mgmtIndexNext",
  "analysisIndexNext",
] as const);
type _LoadOnLoginTest = DbStoreNameCheck<typeof loadOnLoginNames[number]>;

export const dbStoreNamesDepreciated = [
  "user",
  "propertyDefault",
  "loanDefault",
  "mgmtDefault",

  "property",
  "loan",
  "mgmt",
  "analysis",

  "analysisTableNext",
  "propertyTable",
  "loanTable",
  "mgmtTable",

  "outputListDefault",
  "userOutputList",
  "userVarbList",
  "userSingleList",
  "userOngoingList",
] as const;

export type DbStoreName = typeof dbStoreNamesDepreciated[number];
