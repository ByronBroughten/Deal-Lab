import { isEqual } from "lodash";
import Analyzer from "../../Analyzer";
import array from "../../utils/Arr";
import { Str } from "../../utils/Str";
import {
  FeNameInfo,
  FeVarbInfo,
  SpecificSectionInfo,
} from "../SectionMetas/relSections/rel/relVarbInfoTypes";
import { rowIndexToTableName } from "../SectionMetas/relSectionTypes";
import { FeInfo, Inf } from "../SectionMetas/Info";
import StateSection from "../StateSection";
import { SectionName } from "../SectionMetas/SectionName";

export function findRowCellByColumn(
  this: Analyzer,
  rowInfo: FeInfo<"rowIndex">,
  colInfo: FeNameInfo<"column">
): StateSection<"cell"> | undefined {
  const cells = this.children(rowInfo, "cell");
  const column = this.section(colInfo);
  const colInfoValues = column.varbInfoValues();

  return cells.find((cell) => {
    const cellInfoValues = cell.varbInfoValues();
    if (isEqual(colInfoValues, cellInfoValues)) return true;
  });
}

function sortRowsByOtherColumn(
  analyzer: Analyzer,
  rows: StateSection<SectionName<"rowIndex">>[],
  colInfo: FeNameInfo<"column">
) {
  const nextRows = [...rows].sort((rowA, rowB) => {
    const cellA = analyzer.findRowCellByColumn(rowA.feInfo, colInfo);
    const cellB = analyzer.findRowCellByColumn(rowB.feInfo, colInfo);

    const valueA = cellA ? analyzer.displayVarb("value", cellA.feInfo) : "";
    const valueB = cellB ? analyzer.displayVarb("value", cellB.feInfo) : "";

    return Str.compareAlphanumerically(valueA, valueB);
  });
  return nextRows;
}
function sortRowsByTitle(rows: StateSection<SectionName<"rowIndex">>[]) {
  return rows.sort((rowA, rowB) =>
    Str.compareAlphanumerically(
      rowA.value("title", "string"),
      rowB.value("title", "string")
    )
  );
}
export type SortByColumnOptions = { reverse?: boolean };
export function sortTableRowIdsByColumn(
  this: Analyzer,
  tableName: SectionName<"table">,
  colIdOrTitle: string | "title",
  { reverse = false }: SortByColumnOptions = {}
) {
  const { rowSourceName } = this.sectionMeta(tableName);
  const rows = this.sectionArr(rowSourceName);

  const nextRows =
    colIdOrTitle === "title"
      ? sortRowsByTitle(rows)
      : sortRowsByOtherColumn(this, rows, Inf.fe("column", colIdOrTitle));
  if (reverse) nextRows.reverse();

  const nextRowIds = nextRows.map(({ dbId }) => dbId);
  const tableInfo = this.feInfo(tableName);
  return this.updateValueDirectly(Inf.feVarb("rowIds", tableInfo), nextRowIds);
}

export function resetRowCells(
  this: Analyzer,
  rowInfo: SpecificSectionInfo<SectionName<"rowIndex">>
): [Analyzer, FeVarbInfo[]] {
  let next = this;
  let affectedInfos: FeVarbInfo[] = [];
  const allAffectedInfos: FeVarbInfo[] = [];

  [next, affectedInfos] = next.eraseChildren(rowInfo, "cell");
  allAffectedInfos.push(...affectedInfos);

  const tableName = rowIndexToTableName[rowInfo.sectionName];
  const columns = next.children(tableName, "column");
  for (const column of columns) {
    const varbInfo = column.varbInfoValues();
    const varb = next.findVarb(varbInfo);
    const value = varb ? varb.value("numObj") : "Not Found";
    [next, affectedInfos] = next.addSections({
      sectionName: "cell",
      parentInfo: next.section(rowInfo).feInfo,
      values: { ...varbInfo, value },
    });
    allAffectedInfos.push(...affectedInfos);
  }
  return [next, array.rmDuplicateObjsClone(allAffectedInfos)];
}
export function pushToRowIndexStore(
  this: Analyzer,
  feInfo: FeInfo<"hasRowIndexStore">
): Analyzer {
  let next = this;
  let affectedInfos: FeVarbInfo[] = [];
  const allAffectedInfos: FeVarbInfo[] = [];

  const { indexStoreName } = next.sectionMeta(feInfo.sectionName);
  const { feInfo: indexParentInfo } = next.parent(indexStoreName);

  // I must also update tableName.dbId
  const tableName = rowIndexToTableName[indexStoreName];
  const { feInfo: tableInfo } = next.section(tableName);

  const { feVarbInfo: rowIdsInfo } = next.feVarb("rowIds", tableInfo);
  const rowIds = next.value(rowIdsInfo, "stringArray");

  const { dbId } = next.section(feInfo);
  rowIds.push(dbId);

  next = next.updateValueDirectly(rowIdsInfo, rowIds);

  const title = next.feValue("title", feInfo, "string");
  [next, affectedInfos] = next.addSections({
    sectionName: indexStoreName,
    parentInfo: indexParentInfo,
    dbEntry: {
      dbId: dbId,
      dbSections: {
        [indexStoreName]: [{ dbId, dbVarbs: { title }, childDbIds: {} }],
      },
    },
  });
  allAffectedInfos.push(...affectedInfos);

  const { feInfo: rowInfo } = next.lastSection(indexStoreName);
  [next, affectedInfos] = next.resetRowCells(rowInfo);
  allAffectedInfos.push(...affectedInfos);
  return next.solveVarbs(allAffectedInfos);
}

export function updateRowIndexStore(
  this: Analyzer,
  feInfo: FeInfo<"hasRowIndexStore">
) {
  const { dbId, indexStoreName } = this.section(feInfo);

  const [next, affectedInfos] = this.resetRowCells({
    sectionName: indexStoreName,
    id: dbId,
    idType: "dbId",
  });
  return next.solveVarbs(affectedInfos);
}
