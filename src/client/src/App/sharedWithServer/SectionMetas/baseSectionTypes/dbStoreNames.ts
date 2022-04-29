import { SimpleSectionName } from "../baseSections";

export const dbStoreNamesNext = [
  "propertyIndexNext",
  "loanIndexNext",
  "mgmtIndexNext",
  "analysisIndexNext",

  "property",
  "loan",
  "mgmt",
  "analysis",

  "analysisTableNext",
  "propertyTableNext",
  "loanTableNext",
  "mgmtTableNext",

  "userOutputList",
  "userVarbList",
  "userSingleList",
  "userOngoingList",
] as const;

type TestDbStoreNames<DS extends readonly SimpleSectionName[]> = DS;
type _Test = TestDbStoreNames<typeof dbStoreNamesNext>;

const dbStoreNames = {
  index: ["propertyIndex", "loanIndex", "mgmtIndex", "analysisIndex"] as const,
  arr: [
    "propertyDefault",
    "loanDefault",
    "mgmtDefault",

    "propertyTable",
    "loanTable",
    "mgmtTable",
    "analysisTable",

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
  ] as const,
  section: [
    "propertyIndexNext",
    "loanIndexNext",
    "mgmtIndexNext",
    "analysisIndexNext",
  ] as const,
  arrNext: [
    "property",
    "loan",
    "mgmt",
    "analysis",

    "propertyTable",
    "loanTable",
    "mgmtTable",
    "analysisTable",

    "analysisTableNext",
    "propertyTableNext",
    "loanTableNext",
    "mgmtTableNext",

    "userVarbList",
    "userSingleList",
    "userOngoingList",
  ] as const,
  get all() {
    return [...this.index, ...this.arr, "user"] as const;
  },
} as const;

export const dbStoreNameS = {
  arrs: dbStoreNames,
  is<T extends DbStoreType = "all">(
    value: any,
    type?: T
  ): value is DbStoreName<T> {
    return (this.arrs[type ?? ("all" as T)] as any).includes(value);
  },
} as const;

type DbStoreNames = typeof dbStoreNames;
export type DbStoreType = keyof DbStoreNames;
export type DbStoreName<DN extends DbStoreType = "all"> =
  DbStoreNames[DN][number];
