import { isEqual } from "lodash";
import Analyzer from "../../Analyzer";
import { FeInfo, InfoS } from "../../SectionMetas/Info";
import {
  FeNameInfo,
  SpecificSectionInfo,
} from "../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { rowIndexToTableName } from "../../SectionMetas/relSectionTypes/StoreTypes";
import { SectionName } from "../../SectionMetas/SectionName";
import { Str } from "../../utils/Str";
import StateSection from "../StateSection";
import { internal } from "./internal";

export function saveNewSectionToRowIndexStore(
  this: Analyzer,
  feInfo: FeInfo<"hasRowIndexStore">
): Analyzer {
  let next = this.resetSectionAndChildDbIds(feInfo);

  const { indexStoreName } = next.meta.section(feInfo.sectionName).core;
  const tableName = rowIndexToTableName[indexStoreName];
  const { feInfo: tableInfo } = next.section(tableName);

  const { feVarbInfo: rowIdsInfo } = next.feVarb("rowIds", tableInfo);
  const rowIds = next.value(rowIdsInfo, "stringArray");

  const { dbId } = next.section(feInfo);
  rowIds.push(dbId);

  next = next.directUpdateAndSolve(rowIdsInfo, rowIds);

  const { feInfo: indexParentInfo } = next.parent(indexStoreName);

  const title = next.feValue("title", feInfo, "string");
  next = internal.addSections(next, {
    sectionName: indexStoreName,
    parentFinder: indexParentInfo,
    dbEntry: {
      dbId: dbId,
      dbSections: {
        [indexStoreName]: [{ dbId, dbVarbs: { title }, childDbIds: {} }],
      },
    },
  });

  const { feInfo: rowInfo } = next.lastSection(indexStoreName);
  next = resetRowCells(next, rowInfo);
  return next.solveVarbs();
}

export function updateRowIndexStoreSection(
  this: Analyzer,
  feInfo: FeInfo<"hasRowIndexStore">
) {
  const section = this.section(feInfo);

  const { dbId, indexStoreName } = section;
  const rowInfo = {
    sectionName: indexStoreName,
    id: dbId,
    idType: "dbId",
  } as const;

  let next = resetRowCells(this, rowInfo);
  next = internal.updateValueDirectly(
    next,
    InfoS.feVarb("title", this.section(rowInfo).feInfo),
    section.value("title", "string")
  );
  return next.solveVarbs();
}

function findRowCellByColumn(
  analyzer: Analyzer,
  rowInfo: FeInfo<"rowIndex">,
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

function sortRowsByOtherColumn(
  analyzer: Analyzer,
  rows: StateSection<SectionName<"rowIndex">>[],
  colInfo: FeNameInfo<"column">
) {
  const nextRows = [...rows].sort((rowA, rowB) => {
    const cellA = findRowCellByColumn(analyzer, rowA.feInfo, colInfo);
    const cellB = findRowCellByColumn(analyzer, rowB.feInfo, colInfo);

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
  const { rowSourceName } = this.meta.section(tableName).core;
  const rows = this.sectionArr(rowSourceName);

  const nextRows =
    colIdOrTitle === "title"
      ? sortRowsByTitle(rows)
      : sortRowsByOtherColumn(this, rows, InfoS.fe("column", colIdOrTitle));
  if (reverse) nextRows.reverse();

  const nextRowIds = nextRows.map(({ dbId }) => dbId);
  const tableInfo = this.section(tableName).feInfo;
  return this.directUpdateAndSolve(
    InfoS.feVarb("rowIds", tableInfo),
    nextRowIds
  );
}

function resetRowCells(
  next: Analyzer,
  rowInfo: SpecificSectionInfo<SectionName<"rowIndex">>
): Analyzer {
  next = next.eraseChildren(rowInfo, "cell");

  const tableName = rowIndexToTableName[rowInfo.sectionName];
  const columns = next.childSections(tableName, "column");
  for (const column of columns) {
    const varbInfo = column.varbInfoValues();
    const varb = next.findVarb(varbInfo);
    const value = varb ? varb.value("numObj") : "Not Found";
    next = internal.addSections(next, {
      sectionName: "cell",
      parentFinder: next.section(rowInfo).feInfo,
      values: { ...varbInfo, value },
    });
  }
  return next;
}
