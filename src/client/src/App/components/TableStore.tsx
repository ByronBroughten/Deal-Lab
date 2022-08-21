import React from "react";
import styled from "styled-components";
import { useTableActor } from "../modules/sectionActorHooks/useTableActor";
import { auth } from "../modules/services/authService";
import { isFeUserTableName } from "../sharedWithServer/SectionsMeta/relChildSections";
import { VariableOption } from "../sharedWithServer/StateEntityGetters/VariableGetterSections";
import theme from "../theme/Theme";
import useHowMany from "./appWide/customHooks/useHowMany";
import { MaterialStringEditor } from "./inputs/MaterialStringEditor";
import VarbAutoComplete from "./inputs/VarbAutoComplete";
import ColumnHeader from "./TableStore/ColumnHeader";
import IndexRow from "./TableStore/IndexRow";

interface Props {
  feId: string;
}

export function TableStore({ feId }: Props) {
  const table = useTableActor(feId);
  if (!isFeUserTableName(table.get.selfChildName)) {
    throw new Error("TableStore is only for feUser tables");
  }
  const { filteredRows } = table;
  const { isAtLeastOne, areNone } = useHowMany(filteredRows);

  return (
    <Styled className="TableStore-root">
      {!auth.isToken && (
        <div className="TableStore-notLoggedIn">
          To view saved analyses, create an account or login.
        </div>
      )}
      {auth.isToken && areNone && (
        <div className="TableStore-areNone">None</div>
      )}
      {auth.isToken && isAtLeastOne && (
        <div className="TableStore-viewable">
          <div className="TableStore-titleRow">
            <h5 className="TableStore-title TableStore-controlRowItem">
              {"Deals"}
            </h5>
            <div className="TableStore-controlRow">
              <MaterialStringEditor
                label="Filter by title"
                className="TableStore-filterEditor TableStore-controlRowItem"
                feVarbInfo={table.get.varbInfo("titleFilter")}
              />
              <VarbAutoComplete
                onSelect={(o: VariableOption) => table.addColumn(o.varbInfo)}
                placeholder="Add column"
                className="TableStore-addColumnSelector TableStore-controlRowItem"
              />
            </div>
          </div>
          <table className="TableStore-table">
            <thead>
              <tr>
                <ColumnHeader
                  {...{
                    displayName: "Title",
                    sortRowsAZ: () => table.sortRows("displayName"),
                    sortRowsZA: () =>
                      table.sortRows("displayName", { reverse: true }),
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
                return <IndexRow {...{ feId }} />;
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

  .TableStore-addColumnSelector {
    .MuiInputBase-root {
      min-width: 130px;
    }
  }

  .TableStore-title {
    font-size: 2rem;
    color: ${theme["gray-700"]};
  }
  .TableStore-titleRow {
    display: flex;
    align-items: center;
  }
  .TableStore-controlRow {
    display: flex;
    align-items: flex-start;
  }

  .TableStore-trashBtn {
    width: 1.1rem;
    height: 1.1rem;
  }

  .TableStore-filterEditor {
    .DraftTextField-root {
      min-width: 100px;
    }
  }
  .TableStore-controlRowItem {
    margin: ${theme.s2};
  }

  .TableStore-tableCell {
    vertical-align: middle;
  }
  .TableStore-trashBtn {
    visibility: hidden;
  }

  .TableStore-viewable {
    border-radius: ${theme.br1};
    border: 2px solid ${theme.deal.border};
    padding: ${theme.s2} 0 0 0;
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
    background: ${theme.deal.light};
  }

  .TableStore-thContent {
    display: flex;
  }
  .TableStore-columnArrow {
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
    border-bottom: 1px solid ${theme.deal.border};
  }

  td,
  th {
    padding: 0 ${theme.s2} 0 ${theme.s2};
  }

  tbody {
    tr {
      :hover {
        background: ${theme.deal.main};
        .TableStore-trashBtn {
          visibility: visible;
        }
      }
      :not(:first-child) {
        border-top: 1px solid ${theme.deal.light};
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

  .TableStore-notLoggedIn,
  .TableStore-areNone {
    display: flex;
    justify-content: center;
  }

  .deal:last-child {
    border-bottom: 1px solid ${theme.dark};
  }
  .deal {
    border-top: 1px solid ${theme.dark};
  }
`;
