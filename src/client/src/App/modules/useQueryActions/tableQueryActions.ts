import { VariableOption } from "../../sharedWithServer/Analyzer/methods/get/variableOptions";
import { apiQueriesShared } from "../../sharedWithServer/apiQueriesShared";
import { Inf } from "../../sharedWithServer/SectionMetas/Info";
import { SectionName } from "../../sharedWithServer/SectionMetas/SectionName";
import { useAnalyzerContext } from "../usePropertyAnalyzer";
import { apiQueries } from "./apiQueriesClient";

export function useTableActions(tableName: SectionName<"tableNext">) {
  const { analyzer, setAnalyzerOrdered } = useAnalyzerContext();

  return {
    async sortRows(
      colId: string | "title",
      options: { reverse?: boolean } = {}
    ) {
      const next = analyzer.sortTableRowIdsByColumnNext(
        tableName,
        colId,
        options
      );
      setAnalyzerOrdered(next);
      const reqObj = apiQueriesShared.replaceSectionArr.makeReq({
        analyzer: next,
        sectionName: tableName,
        dbStoreName: tableName,
      });
      await apiQueries.replaceSectionArr(reqObj);
    },
    async removeRow(dbId: string) {
      const { tableSourceNameNext } = analyzer.meta.section(tableName).core;
      // await query.deleteRowIndexEntry(tableSourceNameNext, dbId);
    },
    async addColumn({ varbInfo }: VariableOption) {
      const { feInfo: tableInfo } = analyzer.section(tableName);
      const next = analyzer.addSectionAndSolve("column", tableInfo, {
        values: { ...varbInfo },
      });
      // await query.postTableColumns(tableName, next);
    },
    async removeColumn(feId: string) {
      const columnInfo = Inf.fe("column", feId);
      const next = analyzer.eraseSectionAndSolve(columnInfo);
      const reqObj = apiQueriesShared.replaceSectionArr.makeReq({
        analyzer: next,
        sectionName: tableName,
        dbStoreName: tableName,
      });
      await apiQueries.replaceSectionArr(reqObj);
    },
  };
}
