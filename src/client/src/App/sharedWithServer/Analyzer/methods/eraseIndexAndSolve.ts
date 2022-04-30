import Analyzer from "../../Analyzer";
import { InfoS } from "../../SectionMetas/Info";
import { rowIndexToTableName } from "../../SectionMetas/relSectionTypes/StoreTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import Arr from "../../utils/Arr";

export function eraseIndexAndSolve(
  this: Analyzer,
  sectionName: SectionName<"hasIndexStore">,
  dbId: string
): Analyzer {
  const { indexStoreName } = this.meta.section(sectionName).core;
  const indexInfo = InfoS.db(indexStoreName, dbId);
  return this.eraseSectionAndSolve(indexInfo);
}
export function eraseRowIndexAndSolve(
  this: Analyzer,
  sectionName: SectionName<"hasRowIndexStore">,
  dbId: string
): Analyzer {
  let next = this;

  const { indexStoreName } = this.meta.section(sectionName).core;
  const tableName = rowIndexToTableName[indexStoreName];
  const rowIdsVarb = this.section(tableName).varb("rowIds");

  let rowIds = rowIdsVarb.value("stringArray");
  rowIds = Arr.rmFirstValueClone(rowIds, dbId);
  next = next.directUpdateAndSolve(rowIdsVarb.feVarbInfo, rowIds);
  return next.eraseIndexAndSolve(sectionName, dbId);
}
