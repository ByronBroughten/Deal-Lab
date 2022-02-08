import React from "react";
import styled from "styled-components";
import theme from "../theme/Theme";
import useHowMany from "./appWide/customHooks/useHowMany";
import { useAnalyzerContext } from "../modules/usePropertyAnalyzer";
import MaterialStringEditor from "./inputs/MaterialStringEditor";
import VarbAutoComplete from "./inputs/VarbAutoComplete";
import { VariableOption } from "../sharedWithServer/Analyzer/methods/entitiesVariables";
import { auth } from "../modules/services/authService";
import { useStores } from "../modules/customHooks/useStore";
import { isEqual } from "lodash";
import { Inf } from "../sharedWithServer/Analyzer/SectionMetas/Info";
import { SortByColumnOptions } from "../sharedWithServer/Analyzer/methods/indexRows";
import { SectionName } from "../sharedWithServer/Analyzer/SectionMetas/SectionName";
import { indexStoreToSectionName } from "../sharedWithServer/Analyzer/SectionMetas/relSectionTypes";
import TrashBtn from "./general/TrashBtn";
import ColumnHeader from "./SectionTable/ColumnHeader";
import useToggleView from "../modules/customHooks/useToggleView";

type Props = { tableName: SectionName<"table"> };

export default function SectionTable({ tableName }: Props) {
  const { analyzer, setAnalyzerOrdered } = useAnalyzerContext();
  const store = useStores();

  const table = analyzer.section(tableName);
  const sortedRowIds = table.value("rowIds", "stringArray");

  const { rowSourceName } = analyzer.sectionMeta(tableName);
  const rows = sortedRowIds.map((dbId) =>
    analyzer.section(Inf.db(rowSourceName, dbId))
  );

  const { isAtLeastOne, areNone } = useHowMany(rows);

  const { feVarbInfo: filterInfo } = table.varb("searchFilter");
  const filter = table.value("searchFilter", "string");
  const filteredRows = rows.filter((row) => {
    return row.value("title", "string").includes(filter);
  });

  const columns = analyzer.children(tableName, "column");
  const displayNameColumns = columns.map((column) => ({
    displayName: analyzer.displayNameOrNotFound(column.varbInfoValues()),
    feId: column.feId,
  }));

  async function sortRows(
    colId: string | "title",
    options: SortByColumnOptions = {}
  ) {
    const next = analyzer.sortTableRowIdsByColumn(tableName, colId, options);
    setAnalyzerOrdered(next);
    await store.postEntryArr(tableName, next);
  }

  async function addColumn({ varbInfo }: VariableOption) {
    const { feInfo: tableInfo } = analyzer.section(tableName);
    const next = analyzer.addSectionAndSolve("column", tableInfo, {
      values: { ...varbInfo },
    });
    await store.postTableColumns(tableName, next);
  }
  async function removeColumn(feId: string) {
    const columnInfo = Inf.fe("column", feId);
    const next = analyzer.eraseSectionAndSolve(columnInfo);
    await store.postTableColumns(tableName, next);
  }

  async function removeRow(dbId: string) {
    const mainSectionName = indexStoreToSectionName[rowSourceName];
    store.deleteRowIndexEntry(mainSectionName, dbId);
  }

  return (
    <Styled className="SectionTable-root">
      {!auth.isLoggedIn && (
        <div className="SectionTable-notLoggedIn">
          To view saved analyses, create an account or login.
        </div>
      )}
      {auth.isLoggedIn && areNone && (
        <div className="SectionTable-areNone">You have no saved analyses.</div>
      )}
      {auth.isLoggedIn && isAtLeastOne && (
        <div className="SectionTable-viewable">
          <div className="SectionTable-controlRow">
            <MaterialStringEditor
              label="Filter by title"
              className="SectionTable-filterEditor SectionTable-controlRowItem"
              feVarbInfo={filterInfo}
            />
            <VarbAutoComplete
              onSelect={addColumn}
              placeholder="Add column"
              className="SectionTable-addColumnSelector SectionTable-controlRowItem"
            />
          </div>
          <table className="SectionTable-table">
            <thead>
              <tr>
                <ColumnHeader
                  {...{
                    displayName: "Title",
                    sortRowsAZ: () => sortRows("title"),
                    sortRowsZA: () => sortRows("title", { reverse: true }),
                  }}
                />

                {displayNameColumns.map((col) => {
                  return (
                    <ColumnHeader
                      {...{
                        displayName: col.displayName,
                        sortRowsAZ: () => sortRows(col.feId),
                        sortRowsZA: () => sortRows(col.feId, { reverse: true }),
                        removeColumn: () => removeColumn(col.feId),
                      }}
                    />
                  );
                })}
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => {
                const cells = analyzer.children(row.feInfo, "cell");
                return (
                  <tr className="SectionTable-tableRow">
                    <td className="SectionTable-tableCell">
                      {row.value("title", "string")}
                    </td>
                    {columns.map((column) => {
                      const colInfo = column.varbInfoValues();
                      const cell = cells.find((c) => {
                        const cellInfo = c.varbInfoValues();
                        if (isEqual(colInfo, cellInfo)) return true;
                      });
                      // This works but misses the adornments.
                      const value = cell
                        ? analyzer.displayVarb("value", cell.feInfo)
                        : "?";
                      return (
                        <td className="SectionTable-tableCell">{value}</td>
                      );
                    })}
                    <td className="SectionTable-tableCell">
                      <TrashBtn
                        className="SectionTable-trashBtn"
                        onClick={() => removeRow(row.dbId)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  align-items: center;

  .SectionTable-trashBtn {
    width: 1.1rem;
    height: 1.1rem;
  }

  .SectionTable-controlRow {
    display: flex;
  }
  .SectionTable-filterEditor {
    .DraftTextField-root {
      min-width: 100px;
    }
  }
  .SectionTable-controlRowItem {
    margin: ${theme.s2};
  }

  .SectionTable-tableCell {
    vertical-align: middle;
  }
  .SectionTable-trashBtn {
    visibility: hidden;
  }

  .SectionTable-viewable {
    border-radius: ${theme.br1};
    border: 2px solid ${theme.analysis.border};
    padding: ${theme.s2} 0 0 0;
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
    background: ${theme.analysis.light};
  }

  .SectionTable-thContent {
    display: flex;
  }
  .SectionTable-columnArrow {
    margin-left: ${theme.s1};
  }

  .MuiInputBase-root {
    min-width: 80px;
  }

  .DraftEditor-root {
  }
  .DraftEditor-editorContainer {
  }
  .public-DraftEditor-content {
  }
  .public-DraftStyleDefault-block {
  }

  table {
  }

  thead {
    border-bottom: 1px solid ${theme.analysis.border};
  }

  td,
  th {
    padding: 0 ${theme.s2} 0 ${theme.s2};
  }

  tbody {
    tr {
      :hover {
        background: ${theme.analysis.main};
        .SectionTable-trashBtn {
          visibility: visible;
        }
      }
      :not(:first-child) {
        border-top: 1px solid ${theme.analysis.main};
      }
    }
  }

  th {
    vertical-align: bottom;
    white-space: nowrap;
  }

  td {
    padding-top: ${theme.s1};
    vertical-align: top;
  }

  .SectionTable-notLoggedIn,
  .SectionTable-areNone {
    display: flex;
    justify-content: center;
  }

  .analysis:last-child {
    border-bottom: 1px solid ${theme.dark};
  }
  .analysis {
    border-top: 1px solid ${theme.dark};
  }
`;
