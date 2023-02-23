import { Arr } from "../../utils/Arr";
import { Obj } from "../../utils/Obj";
import { allSectionTraits, getSomeSectionTraits } from "../allSectionTraits";
import { tableRowDbSources } from "../childrenTraits";
import { ChildName, getChildNames } from "../sectionChildrenDerived/ChildName";
import { dbStoreNameS } from "../sectionChildrenDerived/DbStoreName";
import { SectionName } from "../SectionName";

export const hasStoreNameArrs = {
  hasFeDisplayIndex: Obj.entryKeysWithPropOfType(
    allSectionTraits,
    "displayIndexName",
    "string"
  ),
  hasFullIndex: Obj.entryKeysWithPropOfType(
    allSectionTraits,
    "feIndexStoreName",
    "string"
  ),
  get hasIndexStore() {
    return [...this.hasFeDisplayIndex, ...this.hasFullIndex] as const;
  },
  hasCompareTable: Obj.entryKeysWithPropOfType(
    allSectionTraits,
    "compareTableName",
    "string"
  ),
} as const;

// both of these pertain to feStoreNames
const hasToStoreNames = {
  displayIndex: getSomeSectionTraits(
    hasStoreNameArrs.hasFeDisplayIndex,
    "displayIndexName"
  ),
  fullIndex: getSomeSectionTraits(
    hasStoreNameArrs.hasFullIndex,
    "feIndexStoreName"
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
  all: feUserChildNames,
  dbIndexName: tableRowDbSources,
  get fullIndexWithArrStore() {
    return Arr.extractStrict(feUserChildNames, dbStoreNameS.arrs.arrQuery);
  },
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
      "userVarbListMain",
    ] as const);
  },
  displayNameDbSource: tableRowDbSources,
  mainTableName: Arr.extractStrict(feUserChildNames, [
    "propertyMainTable",
    "loanMainTable",
    "mgmtMainTable",
    "dealMainTable",
  ] as const),
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

export type SnFeUserChildNames<SN extends SectionName> = Extract<
  ChildName<"feUser">,
  ChildName<SN>
>;

export type FeDbStoreName = ChildName<"feUser"> & ChildName<"dbStore">;
