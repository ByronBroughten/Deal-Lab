import { Obj } from "../../utils/Obj";
import { relSections } from "../relSections";
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

export const hasToStoreNames = {
  rowIndex: getRelParams(hasStoreNameArrs.hasRowIndex, "rowIndexName"),
  fullIndex: getRelParams(hasStoreNameArrs.hasFullIndex, "fullIndexName"),
  arrStore: getRelParams(hasStoreNameArrs.hasArrStore, "arrStoreName"),
  get indexStore() {
    return {
      ...this.rowIndex,
      ...this.fullIndex,
    } as const;
  },
} as const;

export const storeNameArrs = makeNestedValueArrs(hasToStoreNames);

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
