import { isEqual } from "lodash";
import { DbVarbs } from "../SectionPack/RawSection";
import { InEntityVarbInfo } from "../SectionsMeta/baseSections/baseValues/entities";
import { FeInfoByType } from "../SectionsMeta/Info";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSection } from "../StateGetters/GetterSection";
import { UpdaterSection } from "../StateUpdaters/UpdaterSection";
import { Str } from "../utils/Str";
import { SetterSectionBase } from "./SetterBases/SetterSectionBase";
import { SetterSection } from "./SetterSection";

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
  row(feId: string): GetterSection<"tableRow"> {
    return this.get.child({
      sectionName: "tableRow",
      feId,
    });
  }
  addRowFromSource(feInfo: FeInfoByType<"hasRowIndex">) {
    const source = this.get.getterSection(feInfo);
    const row = this.setter.addAndGetChild("tableRow", {
      dbVarbs: { title: source.value("title", "string") },
    });

    const columns = this.get.children("column");
    for (const col of columns) {
      const { varbInfoValues } = col.varbs;
      const { sectionName, varbName } = varbInfoValues;
      const values = sectionName;
      // if the varbInfoValues have an indexName as a sectionName
      // (for the server-side)
      // replace that with the sectionName of the source
      row.addChild("cell", {
        dbVarbs: {
          ...varbInfo,
          value, // why is the value a numObj? or Not Found
        },
      });
    }

    // a couple of options:
    // 1. do the conversion from the source—make the source
    // able to do that, and add get to it for the rest.
    // 2. convert column values on the client and server side

    // for column of columns, row.add
  }
  private getVarbFinder(
    varbInfo: InEntityVarbInfo
  ): FeVarbInfo<SectionName<"hasRowIndex">> | InEntityVarbInfo {
    // so. if the varbInfo has an indexName
    // it should instead use the present source
    // as the index won't exist.
    // but on the serverside it will use the index.
    if (varbInfo.sectionName === this.indexName) {
      return InfoS.feVarb(varbInfo.varbName, this.sectionFeInfo);
    } else return varbInfo;
  }

  private initRowCells() {
    let next = this.nextSections;
    const columns = next.childSections(this.indexTableName, "column");
    for (const column of columns) {
      const varbInfo = column.varbInfoValues();
      const varbFinder = this.getVarbFinder(varbInfo);
      const varb = next.findVarb(varbFinder);
      const value = varb ? varb.value("numObj") : "Not Found";
      next = next.addSectionsAndSolveNext([
        {
          sectionName: "cell",
          parentInfo: next.section(this.rowDbInfo).feInfo,
          dbVarbs: {
            ...varbInfo,
            value,
          },
        },
      ]);
    }
    this.nextSections = next;
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
    const cells = this.row(rowId).children("cell");
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
