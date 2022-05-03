import { z } from "zod";
import { valueMeta } from "../SectionMetas/baseSections/baseValues";
import {
  InEntityInfo,
  InEntityVarbInfo,
} from "../SectionMetas/baseSections/baseValues/entities";
import { Id } from "../SectionMetas/baseSections/id";
import { DbStoreName } from "../SectionMetas/baseSectionTypes/dbStoreNames";
import { DbInfo } from "../SectionMetas/Info";
import {
  DbNameInfo,
  RelInfoStatic,
} from "../SectionMetas/relSections/rel/relVarbInfoTypes";
import { DbValue } from "../SectionMetas/relSections/rel/valueMetaTypes";
import { ParentName } from "../SectionMetas/relSectionTypes/ParentTypes";
import { AlwaysOneVarbFinder, SectionName } from "../SectionMetas/SectionName";
import { zNanoId, zString } from "../utils/zod";

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

export type DbUser = Record<SectionName<"dbStore">, DbEntry[]>;

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
};

// because of how zod unions and records work, these zod schemas must be
// based on the types—the types can't be based on the zod schemas
const zDbValueArr = Object.values(valueMeta).map((schema) => schema.dbZod) as [
  z.ZodTypeAny,
  z.ZodTypeAny
];

const zDbValue = z.union(zDbValueArr);
const zRawSectionFrame: Record<keyof DbSection, any> = {
  dbId: zNanoId,
  dbVarbs: z.record(zDbValue),
  childDbIds: z.record(z.array(zString)),
};
const zDbSection = z.object(zRawSectionFrame);
const zDbEntryFrame: Record<keyof DbEntry, any> = {
  dbId: z.string(),
  dbSections: z.record(z.array(zDbSection)),
};
export const zDbEntry = z.object(zDbEntryFrame);
export const zDbEntryArr = z.array(zDbEntry);

type MakeDbEntryOptions = {
  dbId?: string;
  dbSections?: DbSections;
  childDbIds?: ChildDbIds;
};
