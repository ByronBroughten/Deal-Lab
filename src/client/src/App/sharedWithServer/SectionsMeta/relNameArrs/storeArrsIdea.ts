import { Obj } from "../../utils/Obj";
import { EntryKeysWithPropOfType } from "../../utils/Obj/entryKeysWithProp";
import {
  dbStoreNames,
  SimpleDbStoreName,
} from "../baseSectionTypes/dbStoreNames";
import { RelSections, relSections } from "../relSections";
import { getRelParams, RelParams } from "./getRelParams";

const indexNameParams = {
  hasRowIndex: "rowIndexName",
  hasFullIndex: "fullIndexName",
} as const;

type IndexNameParams = typeof indexNameParams;
type HasIndexNameParam = keyof IndexNameParams;

type HasIndexNameArrs = {
  [S in HasIndexNameParam]: EntryKeysWithPropOfType<
    RelSections["fe"],
    IndexNameParams[S],
    "string"
  >;
};

export type IndexToSourceNames = {
  [SN in keyof SourceToIndexNames as SourceToIndexNames[SN]]: SN[];
};

type HasRowIndexName = HasIndexNameArrs["hasRowIndex"][number];
type HasFullIndexName = HasIndexNameArrs["hasFullIndex"][number];

type RowSourceToIndexNames = RelParams<HasRowIndexName, "rowIndexName">;
type FullSourceToIndexNames = RelParams<HasFullIndexName, "fullIndexName">;
interface SourceToIndexNames
  extends RowSourceToIndexNames,
    FullSourceToIndexNames {}
// what is the problem?
function makeHasIndexNameArrs(): HasIndexNameArrs {
  return Obj.keys(indexNameParams).reduce((nameArrs, key) => {
    nameArrs[key] = Obj.entryKeysWithPropOfType(
      relSections["fe"],
      indexNameParams[key],
      "string"
    );
    return nameArrs;
  }, {} as HasIndexNameArrs);
}

function getIndexToSourceNames(): IndexToSourceNames {
  const hasIndexNameArrs = makeHasIndexNameArrs();
  const sourceIndexNames = Obj.keys(indexNameParams).reduce(
    (sourceIndexNames, hasIndexKey) => {
      sourceIndexNames = {
        ...sourceIndexNames,
        ...getRelParams(
          hasIndexNameArrs[hasIndexKey],
          indexNameParams[hasIndexKey]
        ),
      } as SourceToIndexNames;
      return sourceIndexNames;
    },
    {} as SourceToIndexNames
  );

  return Obj.keys(sourceIndexNames).reduce((indexToSourceNames, sourceName) => {
    const indexName = sourceIndexNames[sourceName];
    if (!(indexName in indexToSourceNames)) indexToSourceNames[indexName] = [];
    (indexToSourceNames[indexName] as any[]).push(sourceName);
    return indexToSourceNames;
  }, {} as IndexToSourceNames);
}

export const indexToSourceNames = getIndexToSourceNames();

function makeHasStoreNameArrs() {
  const hasIndexNameArrs = makeHasIndexNameArrs();
  return {
    ...hasIndexNameArrs,
    hasArrStore: Obj.entryKeysWithPropOfType(
      relSections["fe"],
      "arrStoreName",
      "string"
    ),
    get hasIndexStore() {
      return [...this.hasRowIndex, ...this.hasFullIndex] as const;
    },
  } as const;
}

export const hasStoreNameArrs = makeHasStoreNameArrs();

const hasToStoreNames = {
  rowIndexNext: getRelParams(hasStoreNameArrs.hasRowIndex, "rowIndexName"),
  fullIndex: getRelParams(hasStoreNameArrs.hasFullIndex, "fullIndexName"),
  arrStore: getRelParams(hasStoreNameArrs.hasArrStore, "arrStoreName"),
  get indexStore() {
    return {
      ...this.rowIndexNext,
      ...this.fullIndex,
    } as const;
  },
} as const;

export const storeNameArrs = makeNestedValueArrs(hasToStoreNames);
type StoreNameArrs = typeof storeNameArrs;
interface StoreNameArrsPlusAll extends StoreNameArrs {
  all: readonly SimpleDbStoreName[];
}

export type SavableSectionType = keyof StoreNameArrsPlusAll;
export type SavableSectionName<SN extends SavableSectionType = "all"> =
  StoreNameArrsPlusAll[SN][number];

const storeNameArrsPlusAll: StoreNameArrsPlusAll = {
  ...storeNameArrs,
  all: dbStoreNames,
};

export const savableNameS = {
  arrs: storeNameArrsPlusAll,
  is<T extends SavableSectionType = "all">(
    value: any,
    type?: T
  ): value is SavableSectionName<T> {
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
