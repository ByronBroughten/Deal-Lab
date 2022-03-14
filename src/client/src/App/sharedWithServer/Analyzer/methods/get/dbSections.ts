import Analyzer from "../../../Analyzer";
import { DbEntry, DbSection, DbSections } from "../../DbEntry";
import { SectionFinder } from "../../SectionMetas/relSections/baseSectionTypes";
import { FeInfo } from "../../SectionMetas/Info";
import { SectionName } from "../../SectionMetas/SectionName";

type StateToDbSectionsOptions = {
  newMainSectionName?: SectionName;
  skipSectionNames?: string[];
  includeInEntitySections?: boolean;
};
type toDbEntryOptions = StateToDbSectionsOptions;

function getDbSection(analyzer: Analyzer, feInfo: FeInfo): DbSection {
  const childDbIds = analyzer.childDbIdArrs(feInfo);
  return analyzer.section(feInfo).toDbSection(childDbIds);
}
function dbSectionAndChildren(
  analyzer: Analyzer,
  info: SectionFinder,
  {
    newMainSectionName,
    skipSectionNames = [],
    includeInEntitySections,
  }: StateToDbSectionsOptions = {}
): DbSections {
  const mainSectionName = analyzer.section(info).sectionName;
  const feInfos = analyzer.nestedFeInfos(info, {
    includeInEntitySections,
    skipSectionNames,
  });

  function getSectionName({ sectionName }: FeInfo) {
    if (sectionName === mainSectionName && newMainSectionName !== undefined)
      return newMainSectionName;
    else return sectionName;
  }

  return feInfos.reduce((dbSections, feInfo) => {
    const sectionName = getSectionName(feInfo);

    const dbSection = getDbSection(analyzer, feInfo);
    const secs = dbSections[sectionName] ?? [];
    secs.push(dbSection);
    dbSections[sectionName] = secs;
    return dbSections;
  }, {} as DbSections);
}

function dbAnalysisIndexEntry(analyzer: Analyzer): DbEntry {
  // this assumes that there's only one analysis in state at a time.
  const analysisEntry = analyzer.dbEntry("analysis");
  const aSections = analysisEntry.dbSections?.analysis;
  const aVarbs = aSections ? aSections[0].dbVarbs : undefined;
  if (!aVarbs) throw new Error("analysisEntry should have dbVarbs");

  const indexEntry = analyzer.dbEntry("main", {
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

export function dbEntry(
  this: Analyzer,
  finder: SectionFinder,
  options: toDbEntryOptions = {}
): DbEntry {
  return {
    dbId: this.section(finder).dbId,
    dbSections: dbSectionAndChildren(this, finder, options),
  };
}

export function dbEntryArr(
  this: Analyzer,
  sectionName: SectionName
): DbEntry[] {
  const feInfos = this.sectionArrInfos(sectionName);
  return feInfos.map((feInfo) => this.dbEntry(feInfo));
}
export function dbEntryArrs<T extends SectionName, S extends T[]>(
  this: Analyzer,
  sectionNames: S
): { [Prop in T]: DbEntry[] } {
  const partial: Partial<{ [Prop in T[number]]: DbEntry[] }> = {};
  for (const sectionName of sectionNames) {
    partial[sectionName] = this.dbEntryArr(sectionName);
  }
  return partial as { [Prop in T]: DbEntry[] };
}

export function dbIndexEntry(
  this: Analyzer,
  finder: SectionFinder<SectionName<"hasIndexStore">>
) {
  const { feInfo, indexStoreName } = this.section(finder);
  if (feInfo.sectionName === "analysis") {
    return dbAnalysisIndexEntry(this);
  } else {
    return this.dbEntry(feInfo, {
      newMainSectionName: indexStoreName,
    });
  }
}