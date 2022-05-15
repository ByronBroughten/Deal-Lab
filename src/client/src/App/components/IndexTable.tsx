import React from "react";
import styled from "styled-components";
import { auth } from "../modules/services/authService";
import {
  IndexTableActionsProps,
  useIndexTableActions,
} from "../modules/TableStateQuerier";
import { useAnalyzerContext } from "../modules/usePropertyAnalyzer";
import { SectionName } from "../sharedWithServer/SectionsMeta/SectionName";
import theme from "../theme/Theme";
import useHowMany from "./appWide/customHooks/useHowMany";
import ColumnHeader from "./IndexTable/ColumnHeader";
import IndexRow from "./IndexTable/IndexRow";
import MaterialStringEditor from "./inputs/MaterialStringEditor";
import VarbAutoComplete from "./inputs/VarbAutoComplete";

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
    displayNameColumns,
  };
}

export default function IndexTable(props: IndexTableActionsProps) {
  const { tableName, indexSourceFinder } = props;
  const {
    searchFilter,
    filteredRows,
    isAtLeastOne,
    areNone,
    displayNameColumns,
  } = useTableParts(tableName);

  const { addColumn, removeColumn, sortRowsAZ, sortRowsZA } =
    useIndexTableActions(props);

  return (
    <Styled className="IndexTable-root">
      {!auth.isLoggedIn && (
        <div className="IndexTable-notLoggedIn">
          To view saved analyses, create an account or login.
        </div>
      )}
      {auth.isLoggedIn && areNone && (
        <div className="IndexTable-areNone">You have no saved analyses.</div>
      )}
      {auth.isLoggedIn && isAtLeastOne && (
        <div className="IndexTable-viewable">
          <div className="IndexTable-titleRow">
            <h5 className="IndexTable-title IndexTable-controlRowItem">
              {"Deals"}
            </h5>
            <div className="IndexTable-controlRow">
              <MaterialStringEditor
                label="Filter by title"
                className="IndexTable-filterEditor IndexTable-controlRowItem"
                feVarbInfo={searchFilter.feVarbInfo}
              />
              <VarbAutoComplete
                onSelect={addColumn}
                placeholder="Add column"
                className="IndexTable-addColumnSelector IndexTable-controlRowItem"
              />
            </div>
          </div>
          <table className="IndexTable-table">
            <thead>
              <tr>
                <ColumnHeader
                  {...{
                    displayName: "Title",
                    sortRowsAZ: () => sortRowsAZ("title"),
                    sortRowsZA: () => sortRowsZA("title"),
                  }}
                />

                {displayNameColumns.map((col) => {
                  return (
                    <ColumnHeader
                      {...{
                        displayName: col.displayName,
                        sortRowsAZ: () => sortRowsAZ(col.feId),
                        sortRowsZA: () => sortRowsZA(col.feId),
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
                return (
                  <IndexRow {...{ rowDbId: row.dbId, indexSourceFinder }} />
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

  .IndexTable-addColumnSelector {
    .MuiInputBase-root {
      min-width: 130px;
    }
  }

  .IndexTable-title {
    font-size: 2rem;
    color: ${theme["gray-700"]};
  }
  .IndexTable-titleRow {
    display: flex;
    align-items: center;
  }
  .IndexTable-controlRow {
    display: flex;
    align-items: flex-start;
  }

  .IndexTable-trashBtn {
    width: 1.1rem;
    height: 1.1rem;
  }

  .IndexTable-filterEditor {
    .DraftTextField-root {
      min-width: 100px;
    }
  }
  .IndexTable-controlRowItem {
    margin: ${theme.s2};
  }

  .IndexTable-tableCell {
    vertical-align: middle;
  }
  .IndexTable-trashBtn {
    visibility: hidden;
  }

  .IndexTable-viewable {
    border-radius: ${theme.br1};
    border: 2px solid ${theme.analysis.border};
    padding: ${theme.s2} 0 0 0;
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
    background: ${theme.analysis.light};
  }

  .IndexTable-thContent {
    display: flex;
  }
  .IndexTable-columnArrow {
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
        .IndexTable-trashBtn {
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

  .IndexTable-notLoggedIn,
  .IndexTable-areNone {
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
