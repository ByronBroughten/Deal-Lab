import {
  indexStoreNames,
  StoreName,
  storeNames,
  StoreSectionName,
} from "../../sectionStores";
import { allSectionChildren } from "../../stateSchemas/allSectionChildren";
import { Obj } from "../../utils/Obj";
import { ChildName } from "./ChildName";
import {
  ChildSectionName,
  ChildSectionNameName,
  childToSectionName,
} from "./ChildSectionName";

export const dbStoreNames = Obj.keys(
  allSectionChildren.dbStore
) as ChildName<"dbStore">[];
export type DbStoreName = (typeof dbStoreNames)[number];
export type DbSectionName<CN extends DbStoreName = DbStoreName> =
  ChildSectionName<"dbStore", CN>;
export type DbNameBySectionName<SN extends DbSectionName> =
  ChildSectionNameName<"dbStore", SN> & DbStoreName;

export interface DbStoreNameProp<CN extends DbStoreName = DbStoreName> {
  dbStoreName: CN;
}
export interface DbStoreInfo<CN extends DbStoreName = DbStoreName>
  extends DbStoreNameProp<CN> {
  dbId: string;
}

const dbStoreNameArrs = {
  all: dbStoreNames,
  sectionQuery: storeNames,
} as const;

export const dbStoreNameS = {
  arrs: dbStoreNameArrs,
  is<T extends DbStoreType = "all">(
    value: any,
    type?: T
  ): value is DbStoreNameByType<T> {
    const arr = this.arrs[type ?? "all"];
    return arr.includes(value);
  },
  validate<T extends DbStoreType = "all">(
    value: any,
    type?: T
  ): DbStoreNameByType<T> {
    if (this.is(value, type)) {
      return value;
    } else
      throw new Error(
        `"${value}" is not a dbStoreName of type "${type ?? "all"}"`
      );
  },
} as const;

export function dbStoreSectionName<CN extends DbStoreName>(
  storeName: CN
): DbSectionName<CN> {
  return childToSectionName("dbStore", storeName);
}

type DbStoreNameArrs = typeof dbStoreNameArrs;
export type DbStoreType = keyof DbStoreNameArrs;
export type DbStoreNameByType<T extends DbStoreType> =
  DbStoreNameArrs[T][number];

export type DbSectionNameByType<T extends DbStoreType> = ChildSectionName<
  "dbStore",
  DbStoreNameByType<T>
>;

export type SectionQueryName = DbStoreNameByType<"sectionQuery">;

type MainSectionToStoreName = {
  [DN in StoreName as StoreSectionName<DN>]: DN[];
};

const sectionToMainDbStoreNames = indexStoreNames.reduce(
  (result, storeName) => {
    const sectionName = childToSectionName("dbStore", storeName);
    if (!result[sectionName]) result[sectionName] = [];
    (result[sectionName] as any).push(storeName);
    return result;
  },
  {} as MainSectionToStoreName
);

export function getSectionDbStoreNames<
  SN extends DbSectionNameByType<"sectionQuery">
>(sectionName: SN): MainSectionToStoreName[SN] {
  return sectionToMainDbStoreNames[sectionName];
}
