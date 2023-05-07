import { Arr } from "../utils/Arr";
import { Obj } from "../utils/Obj";
import { FeIdProp } from "./SectionInfo/NanoIdInfo";

export const sectionStores = {
  outputSection: "outputSection", // hmmm...

  dealMain: "deal",
  propertyMain: "property",
  loanMain: "loan",
  mgmtMain: "mgmt",
  repairsListMain: "onetimeList",
  utilitiesListMain: "ongoingList",
  sellingListMain: "onetimeList",
  capExListMain: "capExList",
  holdingCostsListMain: "ongoingList",
  closingCostsListMain: "onetimeList",
  onetimeListMain: "onetimeList",
  ongoingListMain: "ongoingList",
  numVarbListMain: "numVarbList",
  boolVarbListMain: "boolVarbList",
  outputListMain: "outputList",
} as const;
export const storeNames = Obj.keys(sectionStores);
type SectionStores = typeof sectionStores;
type BasicStoreName = (typeof storeNames)[number];
export type StoreSectionName<CN extends BasicStoreName = BasicStoreName> =
  SectionStores[CN];
export const storeSectionNames = storeNames.reduce((names, storeName) => {
  const sectionName = sectionStores[storeName];
  if (!names.includes(sectionName)) {
    names.push(sectionName);
  }
  return names;
}, [] as StoreSectionName[]);

type SectionToStoreName = {
  [CN in BasicStoreName as StoreSectionName<CN>]: CN;
};
export type StoreName<SN extends StoreSectionName = StoreSectionName> =
  SectionToStoreName[SN];

type SectionToStoreNames = {
  [SN in StoreSectionName]: StoreName<SN>[];
};

const sectionToStoreNames = storeNames.reduce((sectionToSns, storeName) => {
  const sectionName = sectionStores[storeName];
  if (!(sectionName in sectionToSns)) {
    sectionToSns[sectionName] = [];
  }
  (sectionToSns[sectionName] as any[]).push(storeName);
  return sectionToSns;
}, {} as SectionToStoreNames);

export function sectionStoreNames<SN extends StoreSectionName>(
  sectionName: SN
): StoreName<SN>[] {
  return sectionToStoreNames[sectionName] as StoreName<SN>[];
}

export interface StoreNameProp<CN extends StoreName = StoreName> {
  storeName: CN;
}
export interface FeStoreInfo<CN extends StoreName = StoreName>
  extends StoreNameProp<CN>,
    FeIdProp {}

export const indexStoreNames = Arr.extractStrict(storeNames, [
  "dealMain",
  "propertyMain",
  "loanMain",
  "mgmtMain",
  "repairsListMain",
  "utilitiesListMain",
  "capExListMain",
  "holdingCostsListMain",
  "closingCostsListMain",
  "onetimeListMain",
  "ongoingListMain",
  "numVarbListMain",
  "boolVarbListMain",
  "outputListMain",
] as const);
export type IndexStoreName = (typeof indexStoreNames)[number];
export type IndexStoreSectionName<CN extends IndexStoreName = IndexStoreName> =
  SectionStores[CN];
export const indexStoreSectionNames = indexStoreNames.reduce(
  (names, storeName) => {
    const sectionName = sectionStores[storeName];
    if (!names.includes(sectionName)) {
      names.push(sectionName);
    }
    return names;
  },
  [] as IndexStoreSectionName[]
);

export const variableStoreNames = Arr.extractStrict(storeNames, [
  "numVarbListMain",
  "boolVarbListMain",
]);

const singleItemStoreNames = Arr.excludeStrict(storeNames, indexStoreNames);
export type SingleItemStoreName = (typeof singleItemStoreNames)[number];

const storeNamesByType = {
  indexStore: indexStoreNames,
  singleItemStore: singleItemStoreNames,
  variableStore: variableStoreNames,
  all: storeNames,
};

export function getStoreNames<T extends StoreTypeName>(
  typeName: T
): StoreNameByType<T>[] {
  return storeNamesByType[typeName];
}
export function isStoreNameByType<T extends StoreTypeName = "all">(
  value: any,
  typeName?: T
): value is StoreNameByType<T> {
  return (storeNamesByType as any)[typeName ?? "all"].includes(value);
}
export function validateStoreName<T extends StoreTypeName = "all">(
  value: any,
  storeType?: T
): StoreNameByType<T> {
  if (isStoreNameByType(value)) {
    return value;
  } else {
    throw new Error(`"${value}" is not a storeName of type "${storeType}"`);
  }
}

type StoreNamesByType = typeof storeNamesByType;
type StoreTypeName = keyof StoreNamesByType;
export type StoreNameByType<ST extends StoreTypeName> =
  StoreNamesByType[ST][number];

// Depreciating
export const listChildren = {
  repairsListMain: "onetimeList",
  utilitiesListMain: "ongoingList",
  capExListMain: "capExList",
  sellingListMain: "onetimeList",
  holdingCostsListMain: "ongoingList",
  closingCostsListMain: "onetimeList",
  outputListMain: "outputList",
  onetimeListMain: "onetimeList",
  ongoingListMain: "ongoingList",
} as const;
export const listChildrenNames: ListChildName[] = Obj.keys(listChildren);
type ListChildren = typeof listChildren;
export type ListChildName = keyof ListChildren;
