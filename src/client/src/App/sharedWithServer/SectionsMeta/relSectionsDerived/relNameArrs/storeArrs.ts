import { Obj } from "../../../utils/Obj";
import {
  dbStoreNames,
  SimpleDbStoreName,
} from "../../childSectionsDerived/dbStoreNames";
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
  hasArrStore: Obj.entryKeysWithPropOfType(
    relSections,
    "arrStoreName",
    "string"
  ),
  get hasIndexStore() {
    return [...this.hasRowIndex, ...this.hasFullIndex] as const;
  },
} as const;

const hasToStoreNames = {
  // these are dbStore names.
  // I can combine these into one I think.

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

export type SavableSectionType = keyof StoreNameArrsPlusAll;
export type DbSectionName<SN extends SavableSectionType = "all"> =
  StoreNameArrsPlusAll[SN][number];

const storeNameArrsPlusAll: StoreNameArrsPlusAll = {
  ...storeNameArrs,
  all: dbStoreNames,
};

export const savableNameS = {
  arrs: storeNameArrsPlusAll,
  is<T extends SavableSectionType = "all">(
    value: any,
    type?: T
  ): value is DbSectionName<T> {
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
