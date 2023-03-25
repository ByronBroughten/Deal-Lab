import { Arr } from "../utils/Arr";
import { Obj } from "../utils/Obj";

export const sectionStores = {
  outputSection: "outputSection",
  dealCompare: "compareSection",

  dealMain: "deal",
  propertyMain: "property",
  loanMain: "loan",
  mgmtMain: "mgmt",
  repairsListMain: "singleTimeList",
  utilitiesListMain: "ongoingList",
  capExListMain: "capExList",
  holdingCostsListMain: "ongoingList",
  closingCostsListMain: "singleTimeList",
  singleTimeListMain: "singleTimeList",
  ongoingListMain: "ongoingList",
  numVarbListMain: "numVarbList",
  boolVarbListMain: "boolVarbList",
  outputListMain: "outputList",
} as const;
export const storeNames = Obj.keys(sectionStores);
type SectionStores = typeof sectionStores;
type BasicStoreName = typeof storeNames[number];
export type StoreSectionName<CN extends BasicStoreName = BasicStoreName> =
  SectionStores[CN];
type SectionToStoreName = {
  [CN in BasicStoreName as SectionStores[CN]]: CN;
};
export type StoreName<SN extends StoreSectionName = StoreSectionName> =
  SectionToStoreName[SN];

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
  "singleTimeListMain",
  "ongoingListMain",
  "numVarbListMain",
  "boolVarbListMain",
  "outputListMain",
] as const);
export type IndexStoreName = typeof indexStoreNames[number];
const singleItemStoreNames = Arr.excludeStrict(storeNames, indexStoreNames);
export type SingleItemStoreName = typeof singleItemStoreNames[number];

const storeNamesByType = {
  indexStore: indexStoreNames,
  singleItemStore: singleItemStoreNames,
  all: storeNames,
};
type StoreNamesByType = typeof storeNamesByType;
type StoreTypeName = keyof StoreNamesByType;
export type StoreNameByType<ST extends StoreTypeName> =
  StoreNamesByType[ST][number];

// Depreciating
export const listChildren = {
  repairsListMain: "singleTimeList",
  utilitiesListMain: "ongoingList",
  capExListMain: "capExList",
  holdingCostsListMain: "ongoingList",
  closingCostsListMain: "singleTimeList",
  outputListMain: "outputList",
  singleTimeListMain: "singleTimeList",
  ongoingListMain: "ongoingList",
} as const;
export const listChildrenNames: ListChildName[] = Obj.keys(listChildren);
type ListChildren = typeof listChildren;
export type ListChildName = keyof ListChildren;
