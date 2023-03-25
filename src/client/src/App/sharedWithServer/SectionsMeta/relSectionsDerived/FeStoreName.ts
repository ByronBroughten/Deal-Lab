import { Arr } from "../../utils/Arr";
import { Obj } from "../../utils/Obj";
import { tableRowDbSources } from "../allChildrenTraits";
import { allSectionTraits, getSomeSectionTraits } from "../allSectionTraits";
import { ChildName, getChildNames } from "../sectionChildrenDerived/ChildName";
// What if...
export const hasStoreNameArrs = {
  get hasIndexStore() {
    return Obj.entryKeysWithPropOfType(
      allSectionTraits,
      "feIndexStoreName",
      "string"
    );
  },
} as const;

const hasToStoreNames = {
  fullIndex: getSomeSectionTraits(
    hasStoreNameArrs.hasIndexStore,
    "feIndexStoreName"
  ),
} as const;

const indexStoreNames = makeNestedValueArrs(hasToStoreNames);

export type FeStoreName = ChildName<"feUser">;
export type FeStoreType = keyof StoreNameArrs;
export type FeStoreNameByType<SN extends FeStoreType = "all"> =
  StoreNameArrs[SN][number];

const feUserChildNames = getChildNames("feUser");
const feStoreNameArrs = {
  ...indexStoreNames,
  all: feUserChildNames,
  dbIndexName: tableRowDbSources,
  get mainStoreName() {
    return Arr.extractStrict(indexStoreNames.fullIndex, [
      "dealMain",
      "propertyMain",
      "loanMain",
      "mgmtMain",
    ] as const);
  },
  get userListStoreName() {
    return Arr.extractStrict(indexStoreNames.fullIndex, [
      "ongoingListMain",
      "outputListMain",
      "singleTimeListMain",
      "numVarbListMain",
    ] as const);
  },
  displayNameDbSource: tableRowDbSources,
  saveUserLists: Arr.excludeStrict(feUserChildNames, [
    "propertyMain",
    "mgmtMain",
    "loanMain",
    "dealMain",
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
