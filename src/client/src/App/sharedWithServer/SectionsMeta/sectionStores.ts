import { Arr } from "../utils/Arr";
import { Obj } from "../utils/Obj";
import { FeDbStoreName } from "./relSectionsDerived/FeStoreName";

export const sectionStores = {
  outputSection: "outputSection",
  dealCompare: "compareSection",
  mainDealMenu: "mainDealMenu",

  dealIndex: "deal",
  propertyIndex: "property",
  loanIndex: "loan",
  mgmtIndex: "mgmt",
  repairsListIndex: "singleTimeList",
  utilitiesListIndex: "ongoingList",
  capExListIndex: "capExList",
  holdingCostsListIndex: "ongoingList",
  closingCostsListIndex: "singleTimeList",
  singleTimeListIndex: "singleTimeList",
  ongoingListIndex: "ongoingList",
  numVarbListIndex: "numVarbList",
  boolVarbListIndex: "boolVarbList",
  outputListIndex: "outputList",
} as const;

const storeNames = Obj.keys(sectionStores);
const indexStoreNames = Arr.extractStrict(storeNames, [
  "dealIndex",
  "propertyIndex",
  "loanIndex",
  "mgmtIndex",
  "repairsListIndex",
  "utilitiesListIndex",
  "capExListIndex",
  "holdingCostsListIndex",
  "closingCostsListIndex",
  "singleTimeListIndex",
  "ongoingListIndex",
  "numVarbListIndex",
  "boolVarbListIndex",
  "outputListIndex",
] as const);
export type IndexStoreName = typeof indexStoreNames[number];
const singleItemStoreNames = Arr.excludeStrict(storeNames, indexStoreNames);
export type SingleItemStoreName = typeof singleItemStoreNames[number];

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
export type ListChildName = Extract<FeDbStoreName, keyof ListChildren>;
