import { Arr } from "../../utils/Arr";
import { Obj } from "../../utils/Obj";
import { childSections } from "../childSections";
import { ChildSectionName, ChildSectionNameName } from "./ChildSectionName";

export const dbStoreNames = Obj.keys(childSections.dbStore);
export type DbStoreName = typeof dbStoreNames[number];
export type DbSectionName<CN extends DbStoreName = DbStoreName> =
  ChildSectionName<"dbStore", CN>;
export type DbSectionNameName<SN extends DbSectionName> = ChildSectionNameName<
  "dbStore",
  SN
>;
export interface DbStoreNameProp<CN extends DbStoreName = DbStoreName> {
  dbStoreName: CN;
}
export interface DbStoreInfo<CN extends DbStoreName = DbStoreName>
  extends DbStoreNameProp<CN> {
  dbId: string;
}

const mainIndexStoreNames = Arr.extractStrict(dbStoreNames, [
  "dealMain",
  "loanMain",
  "mgmtMain",
  "propertyMain",
  "ongoingListMain",
  "outputListMain",
  "singleTimeListMain",
  "userVarbListMain",
] as const);

const sectionQueryStoreNames = mainIndexStoreNames;
const arrQueryStoreNames = Arr.extractStrict(dbStoreNames, [
  "ongoingListMain",
  "outputListMain",
  "singleTimeListMain",
  "userVarbListMain",
] as const);

const dbStoreNameArrs = {
  all: dbStoreNames,
  sectionQuery: sectionQueryStoreNames,
  arrQuery: arrQueryStoreNames,
  allQuery: [...sectionQueryStoreNames, ...arrQueryStoreNames],
  mainIndex: mainIndexStoreNames,
} as const;

export const dbStoreNameS = {
  arrs: dbStoreNameArrs,
  is<T extends DbStoreType = "all">(
    value: any,
    type?: T
  ): value is DbStoreNameByType<T> {
    return (this.arrs[(type ?? "all") as T] as any).includes(value);
  },
} as const;

type DbStoreNameArrs = typeof dbStoreNameArrs;
export type DbStoreType = keyof DbStoreNameArrs;
export type DbStoreNameByType<T extends DbStoreType> =
  DbStoreNameArrs[T][number];

export type DbSectionNameByType<T extends DbStoreType> = ChildSectionName<
  "dbStore",
  DbStoreNameByType<T>
>;

export type SectionQueryName = DbStoreNameByType<"sectionQuery">;
export type SectionArrQueryName = DbStoreNameByType<"arrQuery">;
export type AllQueryName = DbStoreNameByType<"allQuery">;
