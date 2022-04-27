import { isEqual } from "lodash";
import Analyzer from "../../Analyzer";
import { FeInfo, Inf } from "../../SectionMetas/Info";
import { FeNameInfo } from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import { Str } from "../../utils/Str";
import StateSection from "../StateSection";

export function sortTableRowIdsByColumnNext(
  this: Analyzer,
  tableName: SectionName<"tableNext">,
  colIdOrTitle: string | "title",
  { reverse = false }: { reverse?: boolean } = {}
): Analyzer {
  const sortedRows = getSortedRows(this, tableName, colIdOrTitle);
  if (reverse) sortedRows.reverse();
  const nextRowIds = sortedRows.map(({ feId }) => feId);
  const table = this.section(tableName);
  const nextTable = table.updateChildFeIdArr("tableRow", nextRowIds);
  return this.updateSection(nextTable as StateSection);
}

function getSortedRows(
  analyzer: Analyzer,
  tableName: SectionName<"tableNext">,
  colIdOrTitle: string | "title"
): StateSection<SectionName<"tableRow">>[] {
  const rows = analyzer.childSections(tableName, "tableRow");
  if (colIdOrTitle === "title") return sortRowsByTitle(rows);
  else
    return sortRowsByColumnValue(
      analyzer,
      rows,
      Inf.fe("column", colIdOrTitle)
    );
}

function sortRowsByTitle(rows: StateSection<SectionName<"tableRow">>[]) {
  return rows.sort((r1, r2) =>
    Str.compareAlphanumerically(
      r1.value("title", "string"),
      r2.value("title", "string")
    )
  );
}

function sortRowsByColumnValue(
  analyzer: Analyzer,
  rows: StateSection<SectionName<"tableRow">>[],
  colInfo: FeNameInfo<"column">
): StateSection<SectionName<"tableRow">>[] {
  const rowsWithCellValues = getRowsWithCellValues(analyzer, rows, colInfo);
  const sortedWithCellValues = rowsWithCellValues.sort((r1, r2) =>
    Str.compareAlphanumerically(r1.cellValue, r2.cellValue)
  );
  const sortedRows = sortedWithCellValues.map(({ row }) => row);
  return sortedRows;
}

function getRowsWithCellValues(
  analyzer: Analyzer,
  rows: StateSection<SectionName<"tableRow">>[],
  colInfo: FeNameInfo<"column">
): { row: StateSection<SectionName<"tableRow">>; cellValue: string }[] {
  return rows.map((row) => {
    const cell = findRowCellByColumn(analyzer, row.feInfo, colInfo);
    return {
      row,
      cellValue: cell ? analyzer.displayVarb("value", cell.feInfo) : "",
    };
  });
}

function findRowCellByColumn(
  analyzer: Analyzer,
  rowInfo: FeInfo<"tableRow">,
  colInfo: FeNameInfo<"column">
): StateSection<"cell"> | undefined {
  const cells = analyzer.childSections(rowInfo, "cell");
  const column = analyzer.section(colInfo);
  const colInfoValues = column.varbInfoValues();

  return cells.find((cell) => {
    const cellInfoValues = cell.varbInfoValues();
    if (isEqual(colInfoValues, cellInfoValues)) return true;
  });
}
