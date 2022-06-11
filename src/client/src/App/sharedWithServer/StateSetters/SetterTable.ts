import { isEqual } from "lodash";
import { DbVarbs } from "../SectionPack/RawSection";
import { InEntityVarbInfo } from "../SectionsMeta/baseSections/baseValues/entities";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSection } from "../StateGetters/GetterSection";
import { UpdaterSection } from "../StateUpdaters/UpdaterSection";
import { Str } from "../utils/Str";
import { SetterSectionBase } from "./SetterBases/SetterSectionBase";
import { SetterSection } from "./SetterSection";
import { SetterTableRow } from "./SetterTableRow";

export class SetterTable<
  SN extends SectionName<"tableName"> = SectionName<"tableName">
> extends SetterSectionBase<SN> {
  setter = new SetterSection(this.setterSectionProps);
  get get(): GetterSection<SN> {
    return this.setter.get;
  }
  get updater(): UpdaterSection<SN> {
    return new UpdaterSection(this.setterSectionProps);
  }
  column(feId: string): GetterSection<"column"> {
    return this.get.child({
      sectionName: "column",
      feId,
    });
  }
  hasColumn(feId: string): boolean {
    return this.get.hasChild({
      sectionName: "column",
      feId,
    });
  }
  row(feId: string): SetterTableRow {
    return new SetterTableRow({
      ...this.setterSectionsProps,
      feId,
    });
  }
  alphabeticalRows() {}
  hasRowByDbId(dbId: string): boolean {
    return this.get.hasChildByDbInfo({
      sectionName: "tableRow",
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
  addRow({ title, dbId }: { title: string; dbId: string }): void {
    this.setter.addChild("tableRow", {
      dbId,
      dbVarbs: {
        title,
      },
    });
  }
  addColumn(entityInfo: InEntityVarbInfo): void {
    this.setter.addChild("column", {
      dbVarbs: entityInfo as any as DbVarbs,
    });
  }
  removeColumn(feId: string): void {
    this.setter.removeChild({
      sectionName: "column",
      feId,
    });
  }
  sortTableRowIdsByColumn(
    colIdOrTitle: string | "title",
    { reverse = false }: { reverse?: boolean } = {}
  ) {
    const sortedIds = this.getSortedRowIds(colIdOrTitle);
    if (reverse) sortedIds.reverse();
    this.updater.updateChildFeIds({
      sectionName: "tableRow",
      feIds: sortedIds,
    });
  }
  alphabeticalGetterRows() {
    const feIds = this.getSortedRowIds("title");
    return feIds.map((feId) => this.row(feId));
  }
  getSortedRowIds(colIdOrTitle: string | "title"): string[] {
    const rowsWithCellValues = this.getRowsWithCellValues(colIdOrTitle);
    const sorted = rowsWithCellValues.sort((r1, r2) =>
      Str.compareAlphanumerically(r1.cellValue, r2.cellValue)
    );
    return sorted.map(({ rowId }) => rowId);
  }
  private getRowsWithCellValues(
    colIdOrTitle: string | "title"
  ): RowIdCellValue[] {
    if (colIdOrTitle === "title") return this.getRowsWithTitleCellValues();
    else if (this.hasColumn(colIdOrTitle))
      return this.getRowsWithColCellValues(colIdOrTitle);
    else {
      throw new Error(
        `colIdOrTitle should be "title" or a child columnId, but is neither: ${colIdOrTitle}`
      );
    }
  }
  private getRowsWithTitleCellValues(): RowIdCellValue[] {
    const rows = this.get.children("tableRow");
    return rows.map((row) => ({
      rowId: row.feId,
      cellValue: row.value("title", "string"),
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
    const colInfoValues = column.varbs.varbInfoValues;
    const cell = cells.find((cell) => {
      const cellInfoValues = cell.varbs.varbInfoValues;
      if (isEqual(colInfoValues, cellInfoValues)) return true;
    });
    if (cell) return cell.varb("value").displayValue;
    else return "";
  }
}
type RowColumnIds = {
  rowId: string;
  columnId: string;
};
type RowIdCellValue = { rowId: string; cellValue: string };
