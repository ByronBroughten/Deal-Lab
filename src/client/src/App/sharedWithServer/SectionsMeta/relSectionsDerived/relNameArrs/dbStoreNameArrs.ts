import { Obj } from "../../../utils/Obj";
import { dbStoreNames } from "../../childSectionsDerived/dbStoreNames";
import { tableRowDbSources } from "../../relChildSections";
import { relSections } from "../../relSections";
import { getRelParams } from "./getRelParams";

export const hasStoreNameArrs = {
  hasRowIndex: Obj.entryKeysWithPropOfType(
    relSections,
    "feTableIndexStoreName",
    "string"
  ),
  hasFullIndex: Obj.entryKeysWithPropOfType(
    relSections,
    "feFullIndexStoreName",
    "string"
  ),
  get hasIndexStore() {
    return [...this.hasRowIndex, ...this.hasFullIndex] as const;
  },
} as const;

const hasToStoreNames = {
  tableIndex: getRelParams(
    hasStoreNameArrs.hasRowIndex,
    "feTableIndexStoreName"
  ),
  fullIndex: getRelParams(
    hasStoreNameArrs.hasFullIndex,
    "feFullIndexStoreName"
  ),
  get indexStore() {
    return {
      ...this.tableIndex,
      ...this.fullIndex,
    } as const;
  },
} as const;

const indexStoreNames = makeNestedValueArrs(hasToStoreNames);

export type DbStoreType = keyof StoreNameArrs;
export type DbStoreNameByType<SN extends DbStoreType = "all"> =
  StoreNameArrs[SN][number];

const dbStoreNameArrs = {
  ...indexStoreNames,
  tableRowDbSource: tableRowDbSources,
  all: dbStoreNames,
} as const;
type StoreNameArrs = typeof dbStoreNameArrs;

export const dbStoreNameS = {
  arrs: dbStoreNameArrs,
  is<T extends DbStoreType = "all">(
    value: any,
    type?: T
  ): value is DbStoreNameByType<T> {
    return (this.arrs[(type ?? "all") as T] as any).includes(value);
  },
} as const;

type NestedValueArr<T extends HasNestedValues> = {
  [K in keyof T]: T[K][keyof T[K]][];
};

type HasNestedValues = { [key: string]: { [key: string]: any } };
function makeNestedValueArrs<T extends HasNestedValues>(
  obj: T
): NestedValueArr<T> {
  return Obj.keys(obj).reduce((nestedValueArr, propName) => {
    nestedValueArr[propName] = Obj.values(obj[propName]);
    return nestedValueArr;
  }, {} as NestedValueArr<T>);
}
