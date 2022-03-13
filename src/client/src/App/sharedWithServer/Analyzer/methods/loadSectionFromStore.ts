import Analyzer from "../../Analyzer";
import { FeInfo, Inf } from "../SectionMetas/Info";

export function loadSectionFromFeIndex(
  this: Analyzer,
  feInfo: FeInfo<"hasFullIndexStore">,
  dbId: string
): Analyzer {
  const { indexStoreName } = this.section(feInfo);
  const dbInfo = Inf.db(indexStoreName, dbId);
  const dbEntry = this.dbEntry(dbInfo, {
    newMainSectionName: feInfo.sectionName,
  });
  return this.resetSectionAndSolve(feInfo, { dbEntry });
}
export function loadSectionFromFeDefault(
  this: Analyzer,
  feInfo: FeInfo<"hasDefaultStore">
): Analyzer {
  return this.resetSectionAndSolve(feInfo, { initFromDefault: true });
}

export function setAsDefaultSectionArr(
  this: Analyzer,
  feInfo: FeInfo<"hasDefaultStore">
): Analyzer {
  const { sectionName } = feInfo;
  const { defaultStoreName } = this.sectionMeta(sectionName);

  const dbEntry = this.dbEntry(feInfo, {
    newMainSectionName: defaultStoreName,
  });
  const next = this.loadSectionArrAndSolve(defaultStoreName, [dbEntry], {
    resetDbIds: true,
  });
  return next;
}
