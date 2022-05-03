import { VariableOption } from "../sharedWithServer/Analyzer/methods/get/variableOptions";
import { InfoS } from "../sharedWithServer/SectionMetas/Info";
import { SavableSectionName } from "../sharedWithServer/SectionMetas/relNameArrs/storeArrs";
import {
  SectionFinderNext,
  SectionName,
} from "../sharedWithServer/SectionMetas/SectionName";
import { StateQuerierBase, StateQuerierBaseProps } from "./StateQuerierBase";
import { SectionArrQuerier } from "./StateQueriersShared/Queriers";
import { useAnalyzerContext } from "./usePropertyAnalyzer";

export type IndexTableActionsProps = {
  tableName: SectionName<"tableNext">;
  indexSourceFinder: SectionFinderNext<"hasRowIndex">;
};
interface TableStateQuerierProps
  extends IndexTableActionsProps,
    StateQuerierBaseProps {}
export class TableStateQuerier extends StateQuerierBase {
  readonly tableName: SectionName<"tableNext">;
  readonly indexSourceFinder: SectionFinderNext<"hasRowIndex">;
  constructor({
    tableName,
    indexSourceFinder,
    ...rest
  }: TableStateQuerierProps) {
    super(rest);
    this.tableName = tableName;
    this.indexSourceFinder = indexSourceFinder;
  }

  private get tableQuerier() {
    return new SectionArrQuerier(this.tableName);
  }
  get indexName(): SectionName<"rowIndexNext"> {
    return this.sections.sectionMeta(this.tableName).get("tableIndexName");
  }
  private async sendTable(): Promise<SavableSectionName<"arrStore">> {
    return this.tableQuerier.replace(
      this.nextSections.makeRawSectionPackArr(
        this.tableName as SavableSectionName<"arrStore">
      )
    );
  }

  async sortRows(
    colFeId: string | "title",
    options: { reverse?: boolean } = {}
  ) {
    // send the whole table
    this.nextSections = this.sections.sortTableRowIdsByColumnNext(
      this.tableName,
      colFeId,
      options
    );
    this.setNextSectionsAsState();
    this.sendTable();
  }
  async removeColumn(columnFeId: string) {
    const columnInfo = InfoS.fe("column", columnFeId);
    this.nextSections = this.sections.eraseSectionAndSolve(columnInfo);
    this.setNextSectionsAsState();
    this.sendTable();
  }
  async addColumn({ varbInfo }: VariableOption) {
    // For this, you will need the sections on the server side
    // You will need to do what you were worried about.
    // You can ignore the column stuff for now.
    // const { feInfo: tableInfo } = this.sections.section(this.tableName);
    // this.nextSections = this.sections.addSectionAndSolve("column", tableInfo, {
    //     values: { ...varbInfo },
    // });
    // this.setNextSectionsAsState()
    // this.trySendTableRevertIfFail();
  }
}

// async postTableColumns(
//   tableName: SectionName<"table">,
//   next: Analyzer = analyzer
// ) {
//   const { rowSourceName } = analyzer.sectionMeta(tableName).core;
//   const tableEntryArr = next.dbEntryArr(tableName);
//   const res = await crud.postTableColumns(tableEntryArr, tableName);
//   if (res) {
//     next = next.loadSectionArrAndSolve(rowSourceName, res.data);
//     setAnalyzerOrdered(next);
//   }
// }

export function useIndexTableActions(props: IndexTableActionsProps) {
  const { analyzer, setAnalyzerOrdered } = useAnalyzerContext();
  const tableQuerier = new TableStateQuerier({
    sections: analyzer,
    setSectionsOrdered: setAnalyzerOrdered,
    ...props,
  });

  return {
    addColumn: (option: VariableOption) => tableQuerier.addColumn(option),
    removeColumn: (colFeId: string) => tableQuerier.removeColumn(colFeId),

    sortRowsAZ: (titleOrColId: string) => tableQuerier.sortRows(titleOrColId),
    sortRowsZA: (titleOrColId: string) =>
      tableQuerier.sortRows(titleOrColId, { reverse: true }),
  };
}
