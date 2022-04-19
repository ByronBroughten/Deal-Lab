const dbStoreNames = {
  index: ["propertyIndex", "loanIndex", "mgmtIndex", "analysisIndex"] as const,
  arr: [
    "property",
    "propertyDefault",
    "propertyTable",
    "loan",
    "loanDefault",
    "loanTable",
    "mgmt",
    "mgmtDefault",
    "mgmtTable",
    "analysis",
    "analysisDefault",
    "analysisTable",
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
