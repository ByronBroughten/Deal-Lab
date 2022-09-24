import { Obj } from "../../../utils/Obj";
import { ChildName, getChildNames } from "../../childSectionsDerived/ChildName";
import { tableRowDbSources } from "../../relChildSections";
import { allSectionTraits, getSomeSectionTraits } from "../../sectionsTraits";
import { Arr } from "./../../../utils/Arr";

export const hasStoreNameArrs = {
  hasDisplayIndex: Obj.entryKeysWithPropOfType(
    allSectionTraits,
    "displayIndexName",
    "string"
  ),
  hasFullIndex: Obj.entryKeysWithPropOfType(
    allSectionTraits,
    "feFullIndexStoreName",
    "string"
  ),
  get hasIndexStore() {
    return [...this.hasDisplayIndex, ...this.hasFullIndex] as const;
  },
} as const;

// both of these pertain to feStoreNames
const hasToStoreNames = {
  displayIndex: getSomeSectionTraits(
    hasStoreNameArrs.hasDisplayIndex,
    "displayIndexName"
  ),
  fullIndex: getSomeSectionTraits(
    hasStoreNameArrs.hasFullIndex,
    "feFullIndexStoreName"
  ),
  get indexStore() {
    return {
      ...this.displayIndex,
      ...this.fullIndex,
    } as const;
  },
} as const;

const indexStoreNames = makeNestedValueArrs(hasToStoreNames);

export type FeStoreName = ChildName<"feUser">;
export type FeStoreType = keyof StoreNameArrs;
export type FeStoreNameByType<SN extends FeStoreType = "all"> =
  StoreNameArrs[SN][number];

const feUserChildNames = getChildNames("feUser");
const feStoreNameArrs = {
  ...indexStoreNames,
  dbIndexName: tableRowDbSources,
  displayNameDbSource: tableRowDbSources,
  all: feUserChildNames,
  displayStoreName: Arr.extractStrict(feUserChildNames, [
    "dealDisplayStore",
    "mgmtDisplayStore",
    "loanDisplayStore",
    "propertyDisplayStore",
  ] as const),
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
