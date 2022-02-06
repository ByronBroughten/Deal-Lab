import Analyzer from "../../Analyzer";
import { DbNameInfo } from "../SectionMetas/relSections/rel/relVarbInfoTypes";
import {
  ExtraStoreNameAlwaysOne,
  ExtraStoreNameOneParent,
} from "../SectionMetas/relSectionTypes";
import { FeInfo, Inf } from "../SectionMetas/Info";
import StateSection from "../StateSection";

export function pushToIndexStore(
  this: Analyzer,
  feInfo: FeInfo<"hasFullIndexStore">
): Analyzer {
  const feStoreName = this.section(feInfo).meta.indexStoreName;
  const dbEntry = this.toDbEntry(feInfo, {
    newMainSectionName: feStoreName,
  });
  const parentInfo = this.parent(feStoreName).feInfo;
  return this.addSectionAndSolve(feStoreName, parentInfo, {
    dbEntry: dbEntry,
  });
}

export function stateToUpdateSingleStoreArr(
  this: Analyzer,
  feInfo: FeInfo<"savable">,
  feStoreName: ExtraStoreNameAlwaysOne
): Analyzer {
  const dbEntry = this.toDbEntry(feInfo, {
    newMainSectionName: feStoreName,
  });
  return this.loadSectionArrAndSolve(feStoreName, [dbEntry]);
}
export function updateIndexStoreEntry(
  this: Analyzer,
  feInfo: FeInfo<"hasFullIndexStore">
): Analyzer {
  const feStoreName = this.section(feInfo).indexStoreName;
  const dbEntry = this.toDbEntry(feInfo, {
    newMainSectionName: feStoreName,
  });
  const storeInfo: DbNameInfo<typeof feStoreName> = {
    id: dbEntry.dbId,
    idType: "dbId",
    sectionName: feStoreName,
  } as const;
  return this.resetSectionAndSolve(storeInfo, { dbEntry });
}

export function fullStoreEntries(
  this: Analyzer,
  feStoreName: ExtraStoreNameOneParent
): StateSection[] {
  // Get the parent so that the order is preserved.
  const parent = this.parent(feStoreName);
  return parent.childFeIds(feStoreName).map((id) => {
    return this.section(Inf.fe(feStoreName, id));
  }) as StateSection[];
}
export function fullStoreTitlesAndDbIds(
  this: Analyzer,
  sectionName: ExtraStoreNameOneParent
): { title: string; dbId: string }[] {
  return this.fullStoreEntries(sectionName).map((section) => ({
    title: section.value("title", "string"),
    dbId: section.dbId,
  }));
}
