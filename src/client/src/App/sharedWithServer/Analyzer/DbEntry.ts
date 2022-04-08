import { z } from "zod";
import { DbUser } from "../DbUser";
import { zNanoId, zString } from "../utils/zod";
import { DbInfo, Inf } from "./SectionMetas/Info";
import { ParentName } from "./SectionMetas/relNameArrs/ParentTypes";
import { relSections } from "./SectionMetas/relSections";
import { valueMeta } from "./SectionMetas/relSections/baseSections/baseValues";
import {
  InEntityInfo,
  InEntityVarbInfo,
} from "./SectionMetas/relSections/baseSections/baseValues/NumObj/entities";
import { Id } from "./SectionMetas/relSections/baseSections/id";
import { DbStoreName } from "./SectionMetas/relSections/baseSectionTypes";
import {
  DbNameInfo,
  RelInfoStatic,
} from "./SectionMetas/relSections/rel/relVarbInfoTypes";
import { DbValue } from "./SectionMetas/relSections/rel/valueMetaTypes";
import { AlwaysOneVarbFinder, SectionName } from "./SectionMetas/SectionName";

export type DbVarbs = {
  [varbName: string]: DbValue;
};
export type ChildDbIds = {
  [sectionName: string]: string[];
};
export type DbSection = {
  dbId: string;
  dbVarbs: DbVarbs;
  childDbIds: ChildDbIds;
};
type FullDbSections = Record<SectionName | SectionName<"dbStore">, DbSection[]>;
export type DbSections = Partial<FullDbSections>;
export type DbEntry = {
  dbId: string;
  dbSections: DbSections;
};

type EntryPack<S extends SectionName<"dbStore"> = SectionName<"dbStore">> = [
  S,
  DbEntry
];

type InitColumn = { dbId: string; values: { [key: string]: string } };

// this would be better as a class object.
export const DbEnt = {
  initEntry<S extends SectionName | DbStoreName>(
    sectionName: S,
    dbVarbs: DbVarbs,
    {
      childDbIds = {},
      dbId = Id.make(),
      dbSections = {},
    }: MakeDbEntryOptions = {}
  ): DbEntry {
    return {
      dbId,
      dbSections: {
        [sectionName]: [this.initSection(dbId, dbVarbs, childDbIds)],
        ...dbSections,
      },
    };
  },
  initSection(
    dbId: string = Id.make(),
    dbVarbs: DbVarbs = {},
    childDbIds: ChildDbIds = {}
  ): DbSection {
    return {
      dbId,
      dbVarbs,
      childDbIds,
    };
  },
  changeMainName(
    dbEntry: DbEntry,
    currentName: SectionName,
    newName: SectionName
  ): DbEntry {
    const { dbSections } = dbEntry;
    const currentSections = dbSections[currentName];
    dbSections[newName] = currentSections;
    delete dbSections[currentName];
    return dbEntry;
  },

  sectionArr(dbEntry: DbEntry, sectionName: SectionName): DbSection[] {
    const sectionArr = dbEntry.dbSections[sectionName];
    if (sectionArr) return sectionArr;
    else
      throw new Error(
        `The sectionArr for ${sectionName} was not found in this dbEntry`
      );
  },

  sectionByStaticInfo(dbEntry: DbEntry, info: RelInfoStatic): DbSection {
    const { sectionName } = info;
    return this.sectionArr(dbEntry, sectionName)[0];
  },

  sectionByDbId(
    dbEntry: DbEntry,
    sectionName: SectionName,
    dbId: string
  ): DbSection {
    const section = dbEntry.dbSections[sectionName]?.find(
      (entry) => entry.dbId === dbId
    );
    if (section) return section;
    throw new Error(
      `A section was not found with name ${sectionName} and dbId ${dbId}`
    );
  },
  sectionByDbInfo(dbEntry: DbEntry, info: DbInfo) {
    const { sectionName, id } = info;
    return this.sectionByDbId(dbEntry, sectionName, id);
  },
  section(
    dbEntry: DbEntry,
    finder: SectionName<"alwaysOne"> | InEntityInfo | DbNameInfo
  ): DbSection {
    if (typeof finder === "string") return this.sectionArr(dbEntry, finder)[0];
    if (finder.idType === "relative")
      return this.sectionByStaticInfo(dbEntry, finder);
    else return this.sectionByDbInfo(dbEntry, finder);
  },
  topSection(dbEntry: DbEntry, mainName: SectionName): DbSection {
    const { dbId } = dbEntry;
    return this.sectionByDbId(dbEntry, mainName, dbId);
  },
  replaceSingleSection(
    dbEntry: DbEntry,
    sectionName: SectionName<"alwaysOne">,
    nextSection: DbSection
  ): DbEntry {
    const sectionArr = this.sectionArr(dbEntry, sectionName);
    sectionArr[0] = nextSection;
    return dbEntry;
  },
  value(
    dbEntry: DbEntry,
    finder: AlwaysOneVarbFinder | InEntityVarbInfo
  ): DbValue {
    const { varbName } = finder;
    if ("id" in finder) {
      return this.section(dbEntry, finder).dbVarbs[varbName];
    } else return this.section(dbEntry, finder.sectionName).dbVarbs[varbName];
  },
  addLikeChildren<S extends SectionName<"hasParent">>(
    dbEntry: DbEntry,
    childSections: DbSection[],
    childName: S,
    parentInfo: DbNameInfo<ParentName<S>>
  ): DbEntry {
    // add the childIds to the parent
    const parentSection = this.section(dbEntry, parentInfo as DbInfo);
    const childIds = childSections.map((child) => child.dbId);
    if (!(childName in parentSection.childDbIds))
      parentSection.childDbIds[childName] = [];
    parentSection.childDbIds[childName].push(...childIds);

    // add the childSections
    const { dbSections } = dbEntry;
    if (!(childName in dbSections)) dbSections[childName] = [];
    dbSections[childName]?.push(...childSections);
    return dbEntry;
  },
  toRowIndexEntry(
    [indexName, fullEntry]: EntryPack<SectionName<"rowIndex">>,
    columns: DbSection[]
  ): DbEntry {
    // for now, there is very little type safety for dbEntry
    const { dbId } = fullEntry;
    const fullSection = this.topSection(fullEntry, indexName);

    // const columns = this.sectionArr(tableEntry, "column");
    const cellArr = columns.reduce((cells, col) => {
      const info = col.dbVarbs as InEntityVarbInfo;
      const value = this.value(fullEntry, info);
      cells.push(this.initSection(undefined, { ...info, value }));
      return cells;
    }, [] as DbSection[]);

    let rowEntry = this.initEntry(
      indexName,
      { title: fullSection.dbVarbs.title },
      { dbId }
    );
    rowEntry = this.addLikeChildren(
      rowEntry,
      cellArr,
      "cell",
      Inf.db(indexName, dbId)
    );
    return rowEntry;
  },
  toRowIndexEntryArr(
    [rowSourceName, sourceEntryArr]: [SectionName<"rowIndex">, DbEntry[]],
    columns: DbSection[]
  ): DbEntry[] {
    const indexRows: DbEntry[] = [];
    for (const sourceEntry of sourceEntryArr) {
      indexRows.push(
        this.toRowIndexEntry([rowSourceName, sourceEntry], columns)
      );
    }
    return indexRows;
  },
  newTableRows(dbUser: DbUser, tableName: SectionName<"table">): DbEntry[] {
    const { rowSourceName } = relSections.db[tableName];

    const tableEntry = dbUser[tableName][0];
    const dbColumns =
      tableEntry.dbSections.column === undefined
        ? []
        : tableEntry.dbSections.column;

    const rowSourceArr = dbUser[rowSourceName];
    if (rowSourceArr) {
      return this.toRowIndexEntryArr([rowSourceName, rowSourceArr], dbColumns);
    } else {
      throw new Error(`No rowSourceArr for ${rowSourceName}`);
    }
  },
  makeTableEntry(
    tableName: SectionName<"table">,
    dbId: string = Id.make(),
    initColumns: InitColumn[] = []
  ) {
    let initTable = DbEnt.initEntry(
      tableName,
      { searchFilter: "", rowIds: [] },
      { dbId }
    );

    return DbEnt.addLikeChildren(
      initTable,
      initColumns.map((column) =>
        DbEnt.initSection(column.dbId, column.values)
      ),
      "column",
      Inf.db(tableName, dbId)
    );
  },
};

// because of how zod unions and records work, these zod schemas must be
// based on the types—the types can't be based on the zod schemas
const zDbValueArr = Object.values(valueMeta).map((schema) => schema.dbZod) as [
  z.ZodTypeAny,
  z.ZodTypeAny
];

const zDbValue = z.union(zDbValueArr);
const zDbSectionFrame: Record<keyof DbSection, any> = {
  dbId: zNanoId,
  dbVarbs: z.record(zDbValue),
  childDbIds: z.record(z.array(zString)),
};
const zDbSection = z.object(zDbSectionFrame);
const zDbEntryFrame: Record<keyof DbEntry, any> = {
  dbId: z.string(),
  dbSections: z.record(z.array(zDbSection)),
};
export const zDbEntry = z.object(zDbEntryFrame);

type MakeDbEntryOptions = {
  dbId?: string;
  dbSections?: DbSections;
  childDbIds?: ChildDbIds;
};
