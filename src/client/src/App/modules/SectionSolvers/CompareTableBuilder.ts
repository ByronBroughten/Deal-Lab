import { SectionPack } from "../../sharedWithServer/SectionsMeta/sectionChildrenDerived/SectionPack";
import { SectionPackByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import { GetterSectionProps } from "../../sharedWithServer/StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { PackBuilderSection } from "../../sharedWithServer/StatePackers.ts/PackBuilderSection";
import { UpdaterSectionBase } from "../../sharedWithServer/StateUpdaters/bases/updaterSectionBase";
import { UpdaterSection } from "../../sharedWithServer/StateUpdaters/UpdaterSection";
import { Str } from "../../sharedWithServer/utils/Str";
import { StrictOmit } from "../../sharedWithServer/utils/types";

type CompareTableProps = StrictOmit<
  GetterSectionProps<"compareTable">,
  "sectionName"
>;
export class CompareTableBuilder extends UpdaterSectionBase<"compareTable"> {
  constructor(props: CompareTableProps) {
    super({
      ...props,
      sectionName: "compareTable",
    });
  }
  get builder(): PackBuilderSection<"compareTable"> {
    return new PackBuilderSection(this.getterSectionProps);
  }
  get updater(): UpdaterSection<"compareTable"> {
    return new UpdaterSection(this.getterSectionProps);
  }
  get get(): GetterSection<"compareTable"> {
    return new GetterSection(this.getterSectionProps);
  }
  row(feId: string): GetterSection<"tableRow"> {
    return this.get.child({
      childName: "tableRow",
      feId,
    });
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
  updateColumns(columnPacks: SectionPack<"column">[]): void {
    this.builder.replaceChildren({
      childName: "column",
      sectionPacks: columnPacks,
    });
  }
  updateRows(rowPacks: SectionPack<"tableRow">[]): void {
    this.builder.replaceChildren({
      childName: "tableRow",
      sectionPacks: rowPacks,
    });
    this.removeUnusedCompareRows();
  }

  private removeUnusedCompareRows() {
    const compareRows = this.builder.children("compareRow");
    for (const row of compareRows) {
      if (!this.hasRowByDbId(row.get.valueNext("dbId"))) {
        this.builder.removeChild({
          childName: "compareRow",
          feId: row.feId,
        });
      }
    }
  }
  hasRowByDbId(dbId: string): boolean {
    return this.get.hasChildByDbInfo({
      childName: "tableRow",
      dbId,
    });
  }
  createRow(sourcePack: SectionPackByType<"hasIndexStore">): void {
    const source = PackBuilderSection.loadAsOmniChild(sourcePack).get;
    const displayName = source.valueNext("displayName").mainText;
    const row = this.builder.addAndGetChild("tableRow", {
      dbId: source.dbId,
      sectionValues: { displayName },
    });
    for (const column of this.get.children("column")) {
      const varbInfo = column.valueEntityInfo();
      let displayVarb = "N/A";
      if (source.hasVarbByFocalMixed(varbInfo)) {
        const varb = source.varbByFocalMixed(column.valueEntityInfo());
        displayVarb = varb.displayVarb();
      }
      row.addChild("cell", {
        sectionValues: {
          columnFeId: column.feId,
          valueEntityInfo: varbInfo,
          displayVarb,
        },
      });
    }
  }
  get columnPacks(): SectionPack<"column">[] {
    return this.builder.makeChildPackArr("column");
  }
  get rowPacks(): SectionPack<"tableRow">[] {
    return this.builder.makeChildPackArr("tableRow");
  }
  static initAsOmniChild(): CompareTableBuilder {
    const compareTable = PackBuilderSection.initAsOmniChild("compareTable");
    return new CompareTableBuilder(compareTable.getterSectionProps);
  }
  sortRowsByDisplayName(options: SortOptions = {}) {
    const rows = this.getDisplayNameSortValues();
    this.updateRowOrder(rows, options);
  }
  sortRowsByColumn(colId: string, options: SortOptions = {}) {
    const sortedRows = this.getColumnSortValues(colId);
    this.updateRowOrder(sortedRows, options);
  }
  alphabeticalGetterRows() {
    const rows = this.getDisplayNameSortValues();
    const feIds = this.getSortedFeIds(rows);
    return feIds.map((feId) => this.row(feId));
  }
  private getDisplayNameSortValues(): RowIdsortValue[] {
    const rows = this.get.children("tableRow");
    return rows.map((row) => ({
      rowFeId: row.feId,
      sortValue: row.value("displayName", "string"),
    }));
  }

  private getColumnSortValues(columnFeId: string): RowIdsortValue[] {
    if (this.hasColumn(columnFeId)) {
      const rowIds = this.get.childFeIds("tableRow");
      return rowIds.map((rowFeId) => {
        return {
          rowFeId,
          sortValue: this.sortValueByColumn({ rowFeId, columnFeId }),
        };
      });
    } else {
      throw new Error(
        `columnFeId "${columnFeId}" is missing in table ${this.sectionName}`
      );
    }
  }
  private sortValueByColumn({ rowFeId, columnFeId }: RowColumnIds): string {
    const column = this.column(columnFeId);
    const cells = this.row(rowFeId).children("cell");
    const cell = cells.find((cell) => {
      if (cell.dbId === column.dbId) return true;
    });
    if (cell) return cell.value("displayVarb", "string");
    else return "";
  }
  private updateRowOrder(rows: RowIdsortValue[], options: SortOptions): void {
    const sortedFeIds = this.getSortedFeIds(rows);
    if (options.reverse) sortedFeIds.reverse();
    this.updater.updateChildFeIds({
      childName: "tableRow",
      feIds: sortedFeIds,
    });
  }
  private getSortedFeIds(rows: RowIdsortValue[]) {
    const sortedRows = this.sortByValue(rows);
    return sortedRows.map((row) => row.rowFeId);
  }
  private sortByValue(rows: RowIdsortValue[]) {
    return rows.sort((r1, r2) =>
      Str.compareAlphanumerically(r1.sortValue, r2.sortValue)
    );
  }
}

type RowColumnIds = {
  rowFeId: string;
  columnFeId: string;
};
type RowIdsortValue = { rowFeId: string; sortValue: string };

export type SortOptions = { reverse?: boolean };
