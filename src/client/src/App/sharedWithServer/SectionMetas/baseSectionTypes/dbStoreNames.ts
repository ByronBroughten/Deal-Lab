import Arr from "../../utils/Arr";
import { SimpleSectionName } from "../baseSections";

export const dbStoreNamesNext = [
  "user",

  "property",
  "loan",
  "mgmt",
  "analysis",

  "propertyIndexNext",
  "loanIndexNext",
  "mgmtIndexNext",
  "analysisIndexNext",

  "analysisTableNext",
  "propertyTableNext",
  "loanTableNext",
  "mgmtTableNext",

  "userOutputList",
  "userVarbList",
  "userSingleList",
  "userOngoingList",
] as const;

export type SimpleDbStoreName = typeof dbStoreNamesNext[number];
type TestDbStoreNames<DS extends readonly SimpleSectionName[]> = DS;
type _Test1 = TestDbStoreNames<typeof dbStoreNamesNext>;

type DbStoreNameCheck<DS extends SimpleDbStoreName> = DS;
export const feGuestAccessNames = [
  "property",
  "loan",
  "mgmt",
  "analysis",

  "userOutputList",
  "userVarbList",
  "userSingleList",
  "userOngoingList",
] as const;
type _FeGuestAccessTest = DbStoreNameCheck<typeof feGuestAccessNames[number]>;

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
  "propertyTableNext",
  "loanTableNext",
  "mgmtTableNext",

  "outputListDefault",
  "userOutputList",
  "userVarbList",
  "userSingleList",
  "userOngoingList",
] as const;

export type DbStoreName = typeof dbStoreNamesDepreciated[number];
