import { Arr } from "../../utils/Arr";
import { SimpleSectionName } from "../baseSections";

const fullIndexStore = {
  children: ["outputList", "varbList", "singleTimeList", "ongoingList"],
};

// ideal:
// whenever a section is loaded, its descendants are looked through,
// from children on down
// if a childName is a dbStoreName, each child is searched for in the db
// if it is found, it replaces the child, and the process continues.

// I could make this happen by creating a section that has every other
// section as a child.

// I then create a sectionBuilder focused round that section
// that builder then adds the sectionPack from the db as a child
// and refocuses on that.
// then we go down the children, building out the sectionPackBuilder
// as we go
// I think this works!

const dbStoreNamesNext = [
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
  "propertyTableStore",
  "dealTableStore",
  "loanTableStore",
  "mgmtTableStore",
];
export const dbStoreNames = [
  "main",

  "user",
  "deal",
  "property",
  "mgmt",
  "loan",
  // "table",

  "propertyTableStore",
  "dealTableStore",
  "loanTableStore",
  "mgmtTableStore",

  "userOutputList",
  "userVarbList",
  "userSingleList",
  "userOngoingList",
] as const;

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
