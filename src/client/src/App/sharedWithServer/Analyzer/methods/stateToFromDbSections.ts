import Analyzer from "../../Analyzer";
import { DbEntry, DbSection, DbSections } from "../DbEntry";
import { SectionFinder } from "../SectionMetas/relSections/baseSectionTypes";
import { FeInfo } from "../SectionMetas/Info";
import { SectionName } from "../SectionMetas/SectionName";

export function stateToDbSection(this: Analyzer, feInfo: FeInfo): DbSection {
  const childDbIds = this.childDbIds(feInfo);
  return this.section(feInfo).toDbSection(childDbIds);
}

type StateToDbSectionsOptions = {
  newMainSectionName?: SectionName;
  skipSectionNames?: string[];
  includeInEntitySections?: boolean;
};
type toDbEntryOptions = StateToDbSectionsOptions;

export function stateToDbSections(
  this: Analyzer,
  info: SectionFinder,
  {
    newMainSectionName,
    skipSectionNames = [],
    includeInEntitySections,
  }: StateToDbSectionsOptions = {}
): DbSections {
  const mainSectionName = this.section(info).sectionName;
  const feInfos = this.nestedFeInfos(info, {
    includeInEntitySections,
    skipSectionNames,
  });
  // I'm using the nested feInfos.
  // that makes this trickier...
  // I would have to change the dbIds at that point, eh?

  function getSectionName({ sectionName }: FeInfo) {
    if (sectionName === mainSectionName && newMainSectionName !== undefined)
      return newMainSectionName;
    else return sectionName;
  }

  return feInfos.reduce((dbSections, feInfo) => {
    const sectionName = getSectionName(feInfo);

    const dbSection = this.stateToDbSection(feInfo);
    const secs = dbSections[sectionName] ?? [];
    secs.push(dbSection);
    dbSections[sectionName] = secs;
    return dbSections;
  }, {} as DbSections);
}

// Ok, so I'm trying to save something to an index.
// I'm making an indexEntry for something's indexStore
export function toDbIndexEntry(
  this: Analyzer,
  finder: SectionFinder<SectionName<"hasIndexStore">>
) {
  const { feInfo, indexStoreName } = this.section(finder);
  if (feInfo.sectionName === "analysis") {
    return this.toDbAnalysisIndexEntry();
  } else {
    return this.toDbEntry(feInfo, {
      newMainSectionName: indexStoreName,
    });
  }
}
export function toDbAnalysisIndexEntry(this: Analyzer): DbEntry {
  // this assumes that there's only one analysis in state at a time.
  const analysisEntry = this.toDbEntry("analysis");
  const aSections = analysisEntry.dbSections?.analysis;
  const aVarbs = aSections ? aSections[0].dbVarbs : undefined;
  if (!aVarbs) throw new Error("analysisEntry should have dbVarbs");

  const indexEntry = this.toDbEntry("main", {
    newMainSectionName: "analysisIndex",
    skipSectionNames: [
      "userVarbList", // I'll get userVarbList from "includeInEntitySections"
      "analysisIndex",
      "propertyIndex",
      "loanIndex",
      "mgmtIndex",
      "analysisTable",
      "propertyTable",
      "loanTable",
      "mgmtTable",
      "user",
      "propertyDefault",
      "loanDefault",
      "mgmtDefault",
      "analysisDefault",
    ],
    includeInEntitySections: true,
  });
  const { dbId } = analysisEntry;

  const indexSections = indexEntry.dbSections?.analysisIndex;
  indexEntry.dbId = dbId;
  // without changing the dbIds, all of the entries will have main's
  if (indexSections) {
    indexSections[0].dbVarbs = aVarbs;
    indexSections[0].dbId = dbId;
  } else throw new Error("indexEntry should have indexSections");
  return indexEntry;
}

export function toDbEntry(
  this: Analyzer,
  finder: SectionFinder,
  options: toDbEntryOptions = {}
): DbEntry {
  return {
    dbId: this.section(finder).dbId,
    dbSections: this.stateToDbSections(finder, options),
  };
}
export function stateToDbEntries(this: Analyzer, feInfos: FeInfo[]): DbEntry[] {
  return feInfos.map((feInfo) => this.toDbEntry(feInfo));
}

export function toDbEntryArr(
  this: Analyzer,
  sectionName: SectionName
): DbEntry[] {
  const feInfos = this.sectionArrInfos(sectionName);
  return this.stateToDbEntries(feInfos);
}
export function sectionArrsToDbEntries<T extends SectionName, S extends T[]>(
  this: Analyzer,
  sectionNames: S
): { [Prop in T]: DbEntry[] } {
  const partial: Partial<{ [Prop in T[number]]: DbEntry[] }> = {};
  for (const sectionName of sectionNames) {
    partial[sectionName] = this.toDbEntryArr(sectionName);
  }
  return partial as { [Prop in T]: DbEntry[] };
}
