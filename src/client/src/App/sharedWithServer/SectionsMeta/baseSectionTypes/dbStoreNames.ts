import { Arr } from "../../utils/Arr";
import { Obj } from "../../utils/Obj";
import { SimpleSectionName, simpleSectionNames } from "../baseSections";

const fullIndexStore = {
  children: ["outputList", "varbList", "singleTimeList", "ongoingList"],
};

const dbStoreSectionTypes = [
  "main",
  "user",

  "property",
  "loan",
  "mgmt",
  "deal",

  "outputList",
  "varbList",
  "singleTimeList",
  "ongoingList",

  "table",
] as const;

// I like this, because it decouples sectionNames from
// dbStoreNames.

// I like the idea of doing this with children in the front-end state, too
// and I like the idea of those childNames being decoupled from these
// dbStoreNames.

// The decoupling is good.

// How would I go about implementing this?
// first, I would try to implement it just for the main sections

// 1. edit the mongoose schema to add these storeNames.
// 2. add "mainStoreName" to the relSection of each of the sectionTypes
// 3. make addSection share code with updateSection
// 4. make new ordinary CRUD functions on the serverSide
// 5. make their req require both the storeName and the corresponding sectionPack

const dbStoreSchema = {
  dealMain: {
    sectionType: "deal",
    loadToMain: true,
    onlyOne: false,
    tableSoruce: null,
  },
  loanMain: {
    sectionType: "loan",
    loadToMain: true,
    onlyOne: false,
    tableSource: null,
  },
  mgmtMain: {
    sectionType: "mgmt",
    loadToMain: true,
    onlyOne: false,
    tableSource: null,
  },
  propertyMain: {
    sectionType: "property",
    loadToMain: true,
    onlyOne: false,
    tableSource: null,
  },
  // userMain: {
  //   sectionType: "user",
  //   loadToMain: true,
  //   onlyOne: true,
  //   tableSource: null
  // },
  // propertyTableMain: {
  //   sectionType: "table",
  //   tableSource: "propertyMain",
  //   loadToMain: true,
  //   onlyOne: true,
  // },
} as const;

// dbSectionsRaw will have these now, too.
// that complicates things.
//
export const dbStoreNamesNext = Obj.keys(dbStoreSchema);


export const dbStoreNames = Arr.extractStrict(simpleSectionNames, [
  "main",

  "user",
  "deal",
  "property",
  "mgmt",
  "loan",

  "outputList",
  "varbList",
  "singleTimeList",
  "ongoingList",
] as const);

export const loadOnLoginNamesNext = Arr.extract(dbStoreNames, [
  "main",
] as const);

export type SimpleDbStoreName = typeof dbStoreNames[number];
type TestDbStoreNames<DS extends readonly SimpleSectionName[]> = DS;
type _Test1 = TestDbStoreNames<typeof dbStoreNames>;

type DbStoreNameCheck<DS extends SimpleDbStoreName> = DS;
export const feGuestAccessNames = Arr.extract(dbStoreNames, [
  // this determines which sections the dbUser has populated from when the user is a guest.
  "propertyTableStore",
  "dealTableStore",
  "loanTableStore",
  "mgmtTableStore",
  "deal",
] as const);

export const loadOnLoginNames = Arr.exclude(dbStoreNames, ["main"] as const);

type _LoadOnLoginTest = DbStoreNameCheck<typeof loadOnLoginNames[number]>;
