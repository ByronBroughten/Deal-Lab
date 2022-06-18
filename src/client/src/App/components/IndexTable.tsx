import React from "react";
import styled from "styled-components";
import { useTableActor } from "../modules/sectionActorHooks/useTableActor";
import { auth } from "../modules/services/authService";
import { FeInfoByType } from "../sharedWithServer/SectionsMeta/Info";
import { SectionName } from "../sharedWithServer/SectionsMeta/SectionName";
import { VariableOption } from "../sharedWithServer/StateEntityGetters/VariableGetterSections";
import theme from "../theme/Theme";
import useHowMany from "./appWide/customHooks/useHowMany";
import ColumnHeader from "./IndexTable/ColumnHeader";
import IndexRow from "./IndexTable/IndexRow";
import { MaterialStringEditorNext } from "./inputs/MaterialStringEditorNext";
import VarbAutoComplete from "./inputs/VarbAutoComplete";

interface Props {
  indexName: SectionName<"rowIndexNext">;
  feInfo: FeInfoByType<"tableName">;
}
export default function IndexTable({ indexName, feInfo }: Props) {
  const table = useTableActor(feInfo);
  const { filteredRows } = table;
  const { isAtLeastOne, areNone } = useHowMany(filteredRows);
  return (
    <Styled className="IndexTable-root">
      {!auth.isLoggedIn && (
        <div className="IndexTable-notLoggedIn">
          To view saved analyses, create an account or login.
        </div>
      )}
      {auth.isLoggedIn && areNone && (
        <div className="IndexTable-areNone">None</div>
      )}
      {auth.isLoggedIn && isAtLeastOne && (
        <div className="IndexTable-viewable">
          <div className="IndexTable-titleRow">
            <h5 className="IndexTable-title IndexTable-controlRowItem">
              {"Deals"}
            </h5>
            <div className="IndexTable-controlRow">
              <MaterialStringEditorNext
                label="Filter by title"
                className="IndexTable-filterEditor IndexTable-controlRowItem"
                feVarbInfo={table.get.varbInfo("titleFilter")}
              />
              <VarbAutoComplete
                onSelect={(o: VariableOption) => table.addColumn(o.varbInfo)}
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
                    sortRowsAZ: () => table.sortRows("title"),
                    sortRowsZA: () =>
                      table.sortRows("title", { reverse: true }),
                  }}
                />
                {table.columns.map((col) => {
                  return (
                    <ColumnHeader
                      {...{
                        displayName: col.displayNameOrNotFound,
                        sortRowsAZ: () => table.sortRows(col.feId),
                        sortRowsZA: () =>
                          table.sortRows(col.feId, { reverse: true }),
                        removeColumn: () => table.removeColumn(col.feId),
                      }}
                    />
                  );
                })}
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredRows.map(({ feId }) => {
                return <IndexRow {...{ feId, indexName }} />;
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
