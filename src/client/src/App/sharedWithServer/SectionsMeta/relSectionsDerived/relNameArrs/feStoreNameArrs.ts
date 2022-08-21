import { Obj } from "../../../utils/Obj";
import { getChildNames } from "../../childSectionsDerived/ChildName";
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

// both of these pertain to feStoreNames
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

export type FeStoreType = keyof StoreNameArrs;
export type FeStoreNameByType<SN extends FeStoreType = "all"> =
  StoreNameArrs[SN][number];

const feStoreNameArrs = {
  ...indexStoreNames,
  tableRowDbSource: tableRowDbSources,
  all: getChildNames("feUser"),
} as const;
type StoreNameArrs = typeof feStoreNameArrs;

export const feStoreNameS = {
  arrs: feStoreNameArrs,
  is<T extends FeStoreType = "all">(
    value: any,
    type?: T
  ): value is FeStoreNameByType<T> {
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
