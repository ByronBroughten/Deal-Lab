import { InEntityVarbInfo } from "../SectionsMeta/baseSectionsUtils/baseValues/entities";
import { DbVarbs } from "../SectionsMeta/childSectionsDerived/SectionPack/RawSection";
import { GetterSection } from "../StateGetters/GetterSection";
import { UpdaterSection } from "../StateUpdaters/UpdaterSection";
import { Str } from "../utils/Str";
import { SetterSectionBase } from "./SetterBases/SetterSectionBase";
import { SetterSection } from "./SetterSection";
import { SetterTableRow } from "./SetterTableRow";

export class SetterTable extends SetterSectionBase<"table"> {
  setter = new SetterSection(this.setterSectionProps);
  get get(): GetterSection<"table"> {
    return this.setter.get;
  }
  get updater(): UpdaterSection<"table"> {
    return new UpdaterSection(this.setterSectionProps);
  }
  column(feId: string): GetterSection<"column"> {
    return this.get.child({
      childName: "column",
      feId,
    });
  }
  hasColumn(feId: string): boolean {
    return this.get.hasChild({
      childName: "column",
      feId,
    });
  }
  row(feId: string): SetterTableRow {
    return new SetterTableRow({
      ...this.setterSectionsProps,
      feId,
    });
  }
  hasRowByDbId(dbId: string): boolean {
    return this.get.hasChildByDbInfo({
      childName: "tableRow",
      dbId,
    });
  }
  rowByDbId(dbId: string): SetterTableRow {
    const { feId } = this.get.sections.sectionByDbInfo({
      dbId,
      sectionName: "tableRow",
    });
    return this.row(feId);
  }
  get columns(): GetterSection<"column">[] {
    return this.get.children("column");
  }
  addRow({ displayName, dbId }: { displayName: string; dbId: string }): void {
    this.setter.addChild("tableRow", {
      dbId,
      dbVarbs: {
        displayName,
      },
    });
  }
  removeRow(dbId: string): void {
    const { feId } = this.rowByDbId(dbId).get;
    this.setter.removeChild({
      childName: "tableRow",
      feId,
    });
  }
  addColumn(entityInfo: InEntityVarbInfo): void {
    this.setter.addChild("column", {
      dbVarbs: entityInfo as any as DbVarbs,
    });
  }
  removeColumn(feId: string): void {
    this.setter.removeChild({
      childName: "column",
      feId,
    });
  }
  sortTableRowIdsByColumn(
    colIdOrTitle: string | "displayName",
    { reverse = false }: { reverse?: boolean } = {}
  ) {
    const sortedIds = this.getSortedRowIds(colIdOrTitle);
    if (reverse) sortedIds.reverse();
    this.updater.updateChildFeIds({
      childName: "tableRow",
      feIds: sortedIds,
    });
  }
  alphabeticalGetterRows() {
    const feIds = this.getSortedRowIds("displayName");
    return feIds.map((feId) => this.row(feId));
  }
  getSortedRowIds(colIdOrTitle: string | "displayName"): string[] {
    const rowsWithCellValues = this.getRowsWithCellValues(colIdOrTitle);
    const sorted = rowsWithCellValues.sort((r1, r2) =>
      Str.compareAlphanumerically(r1.cellValue, r2.cellValue)
    );
    return sorted.map(({ rowId }) => rowId);
  }
  private getRowsWithCellValues(
    colIdOrTitle: string | "displayName"
  ): RowIdCellValue[] {
    if (colIdOrTitle === "displayName")
      return this.getRowsWithTitleCellValues();
    else if (this.hasColumn(colIdOrTitle))
      return this.getRowsWithColCellValues(colIdOrTitle);
    else {
      throw new Error(
        `colIdOrTitle should be "displayName" or a child columnId, but is neither: ${colIdOrTitle}`
      );
    }
  }
  private getRowsWithTitleCellValues(): RowIdCellValue[] {
    const rows = this.get.children("tableRow");
    return rows.map((row) => ({
      rowId: row.feId,
      cellValue: row.value("displayName", "string"),
    }));
  }
  private getRowsWithColCellValues(columnId: string): RowIdCellValue[] {
    const rowIds = this.get.childFeIds("tableRow");
    return rowIds.map((rowId) => {
      return {
        rowId,
        cellValue: this.cellValueByColumn({ rowId, columnId }),
      };
    });
  }
  private cellValueByColumn({ rowId, columnId }: RowColumnIds): string {
    const column = this.column(columnId);
    const cells = this.row(rowId).get.children("cell");
    const cell = cells.find((cell) => {
      if (cell.dbId === column.dbId) return true;
    });
    if (cell) return cell.value("displayVarb", "string");
    else return "";
  }
}
type RowColumnIds = {
  rowId: string;
  columnId: string;
};
type RowIdCellValue = { rowId: string; cellValue: string };
