import { VariableOption } from "../sharedWithServer/Analyzer/methods/get/variableOptions";
import { InfoS } from "../sharedWithServer/SectionMetas/Info";
import { SectionName } from "../sharedWithServer/SectionMetas/SectionName";
import { StateQuerierBase, StateQuerierBaseProps } from "./StateQuerierBase";
import { useAnalyzerContext } from "./usePropertyAnalyzer";

type TableNameProp = { tableName: SectionName<"tableNext"> };
interface TableQueryActorProps extends TableNameProp, StateQuerierBaseProps {}
class TableQueryActor extends StateQuerierBase {
  readonly tableName: SectionName<"tableNext">;
  constructor({ tableName, ...rest }: TableQueryActorProps) {
    super(rest);
    this.tableName = tableName;
  }

  private async sendTable() {
    await this.apiQuery.replaceSectionArr(
      this.reqMaker.sectionPackArr(this.tableName)
    );
  }
  private async trySendTableRevertIfFail() {
    this.tryAndRevertIfFail(async () => await this.sendTable());
  }

  async deleteSourceSection(dbId: string) {
    const { tableSourceNameNext } = this.sections.meta.section(
      this.tableName
    ).core;
    // await query.deleteRowIndexEntry(tableSourceNameNext, dbId);

    // delete the source section
    // send the whole table
  }
  async sortRows(colId: string | "title", options: { reverse?: boolean } = {}) {
    // send the whole table
    this.nextSections = this.sections.sortTableRowIdsByColumnNext(
      this.tableName,
      colId,
      options
    );
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
  async removeColumn(columnFeId: string) {
    const columnInfo = InfoS.fe("column", columnFeId);
    this.nextSections = this.sections.eraseSectionAndSolve(columnInfo);
    this.setNextSectionsAsState();
    this.sendTable();
  }
}

export function useTableQueryActor(tableName: SectionName<"tableNext">) {
  const { analyzer, setAnalyzerOrdered } = useAnalyzerContext();
  return new TableQueryActor({
    tableName,
    sections: analyzer,
    setSectionsOrdered: setAnalyzerOrdered,
  });
}
