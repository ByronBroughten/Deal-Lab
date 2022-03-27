import Analyzer from "../../Analyzer";
import Arr from "../../utils/Arr";
import { Inf } from "../SectionMetas/Info";
import { rowIndexToTableName } from "../SectionMetas/relNameArrs/StoreTypes";
import { SectionName } from "../SectionMetas/SectionName";

export function eraseIndexAndSolve(
  this: Analyzer,
  sectionName: SectionName<"hasIndexStore">,
  dbId: string
): Analyzer {
  const { indexStoreName } = this.sectionMeta(sectionName);
  const indexInfo = Inf.db(indexStoreName, dbId);
  return this.eraseSectionAndSolve(indexInfo);
}
export function eraseRowIndexAndSolve(
  this: Analyzer,
  sectionName: SectionName<"hasRowIndexStore">,
  dbId: string
): Analyzer {
  let next = this;

  const { indexStoreName } = this.sectionMeta(sectionName);
  const tableName = rowIndexToTableName[indexStoreName];
  const rowIdsVarb = this.section(tableName).varb("rowIds");

  let rowIds = rowIdsVarb.value("stringArray");
  rowIds = Arr.rmFirstValueClone(rowIds, dbId);
  next = next.directUpdateAndSolve(rowIdsVarb.feVarbInfo, rowIds);
  return next.eraseIndexAndSolve(sectionName, dbId);
}
