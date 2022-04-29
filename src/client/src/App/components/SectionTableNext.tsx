import { isEqual } from "lodash";
import React from "react";
import styled from "styled-components";
import { auth } from "../modules/services/authService";
import { useTableQueryActor } from "../modules/TableStateQuerier";
import { useAnalyzerContext } from "../modules/usePropertyAnalyzer";
import { VariableOption } from "../sharedWithServer/Analyzer/methods/get/variableOptions";
import { SectionName } from "../sharedWithServer/SectionMetas/SectionName";
import theme from "../theme/Theme";
import useHowMany from "./appWide/customHooks/useHowMany";
import TrashBtn from "./general/TrashBtn";
import MaterialStringEditor from "./inputs/MaterialStringEditor";
import VarbAutoComplete from "./inputs/VarbAutoComplete";
import ColumnHeader from "./SectionTable/ColumnHeader";

function useTableParts(tableName: SectionName<"tableNext">) {
  const { analyzer } = useAnalyzerContext();

  const table = analyzer.section(tableName);
  const rows = analyzer.childSections(tableName, "tableRow");
  const { isAtLeastOne, areNone } = useHowMany(rows);

  const searchFilter = table.varb("searchFilter");

  const filterValue = searchFilter.value("string");
  const filteredRows = rows.filter((row) => {
    return row.value("title", "string").includes(filterValue);
  });

  const columns = analyzer.childSections(tableName, "column");
  const displayNameColumns = columns.map((column) => ({
    displayName: analyzer.displayNameOrNotFound(column.varbInfoValues()),
    feId: column.feId,
  }));

  return {
    isAtLeastOne,
    areNone,
    searchFilter,
    filteredRows,
    columns,
    displayNameColumns,
  };
}

type Props = { tableName: SectionName<"tableNext"> };
export default function SectionTable({ tableName }: Props) {
  const { analyzer } = useAnalyzerContext();
  const {
    searchFilter,
    filteredRows,
    isAtLeastOne,
    areNone,
    columns,
    displayNameColumns,
  } = useTableParts(tableName);

  const controlTable = useTableQueryActor(tableName);

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
          <div className="SectionTable-titleRow">
            <h5 className="SectionTable-title SectionTable-controlRowItem">
              {"Deals"}
            </h5>
            <div className="SectionTable-controlRow">
              <MaterialStringEditor
                label="Filter by title"
                className="SectionTable-filterEditor SectionTable-controlRowItem"
                feVarbInfo={searchFilter.feVarbInfo}
              />
              <VarbAutoComplete
                onSelect={(option: VariableOption) =>
                  controlTable.addColumn(option)
                }
                placeholder="Add column"
                className="SectionTable-addColumnSelector SectionTable-controlRowItem"
              />
            </div>
          </div>
          <table className="SectionTable-table">
            <thead>
              <tr>
                <ColumnHeader
                  {...{
                    displayName: "Title",
                    sortRowsAZ: () => controlTable.sortRows("title"),
                    sortRowsZA: () =>
                      controlTable.sortRows("title", { reverse: true }),
                  }}
                />

                {displayNameColumns.map((col) => {
                  return (
                    <ColumnHeader
                      {...{
                        displayName: col.displayName,
                        sortRowsAZ: () => controlTable.sortRows(col.feId),
                        sortRowsZA: () =>
                          controlTable.sortRows(col.feId, { reverse: true }),
                        removeColumn: () => controlTable.removeColumn(col.feId),
                      }}
                    />
                  );
                })}
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => {
                const cells = analyzer.childSections(row.feInfo, "cell");
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
                        onClick={() =>
                          controlTable.deleteSourceSection(row.dbId)
                        }
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

  .SectionTable-addColumnSelector {
    .MuiInputBase-root {
      min-width: 130px;
    }
  }

  .SectionTable-title {
    font-size: 2rem;
    color: ${theme["gray-700"]};
  }
  .SectionTable-titleRow {
    display: flex;
    align-items: center;
  }
  .SectionTable-controlRow {
    display: flex;
    align-items: flex-start;
  }

  .SectionTable-trashBtn {
    width: 1.1rem;
    height: 1.1rem;
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
    border-collapse: collapse;
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
        border-top: 1px solid ${theme.analysis.light};
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
