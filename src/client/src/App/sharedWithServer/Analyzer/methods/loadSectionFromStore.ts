import Analyzer from "../../Analyzer";
import { FeInfo } from "../../SectionMetas/Info";

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
  const { defaultStoreName } = this.meta.section(sectionName).core;

  const dbEntry = this.dbEntry(feInfo, {
    newMainSectionName: defaultStoreName,
  });
  const next = this.loadSectionArrAndSolve(defaultStoreName, [dbEntry], {
    resetDbIds: true,
  });
  return next;
}
