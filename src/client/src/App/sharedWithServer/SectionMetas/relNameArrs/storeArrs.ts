import { Obj } from "../../utils/Obj";
import { SimpleDbStoreName } from "../baseSectionTypes/dbStoreNames";
import { relSections } from "../relSections";
import { dbStoreNamesNext } from "./../baseSectionTypes/dbStoreNames";
import { getRelParams } from "./getRelParams";

export const hasStoreNameArrs = {
  hasRowIndex: Obj.entryKeysWithPropOfType(
    relSections["fe"],
    "rowIndexName",
    "string"
  ),
  hasFullIndex: Obj.entryKeysWithPropOfType(
    relSections["fe"],
    "fullIndexName",
    "string"
  ),
  hasArrStore: Obj.entryKeysWithPropOfType(
    relSections["fe"],
    "arrStoreName",
    "string"
  ),
  get hasIndexStoreNext() {
    return [...this.hasRowIndex, ...this.hasFullIndex] as const;
  },
} as const;

const hasToStoreNames = {
  rowIndexNext: getRelParams(hasStoreNameArrs.hasRowIndex, "rowIndexName"),
  fullIndex: getRelParams(hasStoreNameArrs.hasFullIndex, "fullIndexName"),
  arrStore: getRelParams(hasStoreNameArrs.hasArrStore, "arrStoreName"),
  get indexStore() {
    return {
      ...this.rowIndexNext,
      ...this.fullIndex,
    } as const;
  },
} as const;

export const storeNameArrs = makeNestedValueArrs(hasToStoreNames);
type StoreNameArrs = typeof storeNameArrs;
interface StoreNameArrsPlusAll extends StoreNameArrs {
  all: readonly SimpleDbStoreName[];
}

export type DbStoreTypeNext = keyof StoreNameArrsPlusAll;
export type DbStoreNameNext<SN extends DbStoreTypeNext = "all"> =
  StoreNameArrsPlusAll[SN][number];

const storeNameArrsPlusAll: StoreNameArrsPlusAll = {
  ...storeNameArrs,
  all: dbStoreNamesNext,
};

export const dbStoreNameS = {
  arrs: storeNameArrsPlusAll,
  is<T extends DbStoreTypeNext = "all">(
    value: any,
    type?: T
  ): value is DbStoreNameNext<T> {
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
