import Analyzer from "../../Analyzer";
import { DbNameInfo } from "../SectionMetas/relSections/rel/relVarbInfoTypes";
import { FeInfo } from "../SectionMetas/Info";

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
