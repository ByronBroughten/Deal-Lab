import Analyzer from "../../../Analyzer";
import {
  DbEntry,
  DbSection,
  DbSections,
  RawDescendantSections,
  RawSection,
  RawSectionHead,
} from "../../DbEntry";
import { SectionFinder } from "../../SectionMetas/relSections/baseSectionTypes";
import { FeInfo, Inf } from "../../SectionMetas/Info";
import {
  SectionContextProps,
  SectionNam,
  SectionName,
  SectionNameType,
} from "../../SectionMetas/SectionName";
import { Obj } from "../../../utils/Obj";

type StateToDbSectionsOptions = {
  newMainSectionName?: SectionName;
  skipSectionNames?: string[];
  includeInEntitySections?: boolean;
};
type toDbEntryOptions = StateToDbSectionsOptions;

// depreciated
function getDbSection(analyzer: Analyzer, feInfo: FeInfo): DbSection {
  const childDbIds = analyzer.allChildDbIds(feInfo);
  const { dbVarbs, dbId } = analyzer.section(feInfo);
  return {
    dbId,
    dbVarbs,
    childDbIds,
  };
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

export function dbEntryArrs<
  ST extends SectionNameType,
  ToReturn = { [Prop in SectionName<ST & SectionNameType>]: DbEntry[] }
>(this: Analyzer, sectionNameType: ST): ToReturn {
  const partial = {} as ToReturn;
  for (const sectionName of SectionNam.arrs.fe[sectionNameType]) {
    partial[sectionName as keyof typeof partial] = this.dbEntryArr(
      sectionName as any
    ) as any;
  }
  return partial as ToReturn;
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

export function makeRawSection<SN extends SectionName>(
  this: Analyzer,
  finder: SectionFinder<SN>
): RawSection<SectionContextProps<SN, "fe">> {
  const { dbId, dbVarbs } = this.section(finder);
  return {
    dbId,
    dbVarbs,
    childDbIds: this.allChildDbIds(finder),
  };
}

function feIdsToRawSections<S extends SectionName>(
  analyzer: Analyzer,
  sectionName: S,
  feIdArr: string[]
): RawSection<SectionContextProps<S, "fe">>[] {
  return feIdArr.map((id) => {
    const feInfo = Inf.fe(sectionName, id);
    return analyzer.makeRawSection(feInfo);
  });
}
export function makeRawDescendantSections<S extends SectionName>(
  this: Analyzer,
  finder: SectionFinder<S>
): RawDescendantSections<SectionContextProps<S, "fe">> {
  const descendantFeIds = this.descendantFeIds(finder);
  return Obj.entries(descendantFeIds).reduce(
    (rawDescendantSections, [name, feIdArr]) => {
      rawDescendantSections[name] = feIdsToRawSections(
        this,
        name,
        feIdArr
      ) as typeof rawDescendantSections[typeof name];
      return rawDescendantSections;
    },
    {} as RawDescendantSections<SectionContextProps<S, "fe">>
  );
}

export function makeRawSectionHead<S extends SectionName>(
  this: Analyzer,
  finder: SectionFinder<S>
): RawSectionHead<SectionContextProps<S, "fe">> {
  const { sectionName } = this.section(finder);
  return {
    contextName: "fe",
    sectionName: sectionName as S,
    ...this.makeRawSection(finder),
    descendants: this.makeRawDescendantSections(finder),
  };
}
