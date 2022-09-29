import React from "react";
import styled from "styled-components";
import { useTableActor } from "../modules/sectionActorHooks/useTableActor";
import { auth } from "../modules/services/authService";
import { feStoreNameS } from "../sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/feStoreNameArrs";
import { useAuthStatus } from "../sharedWithServer/stateClassHooks/useAuthStatus";
import { VariableOption } from "../sharedWithServer/StateEntityGetters/VariableGetterSections";
import theme from "../theme/Theme";
import useHowMany from "./appWide/customHooks/useHowMany";
import ColumnHeader from "./CompareTable/ColumnHeader";
import IndexRow from "./CompareTable/IndexRow";
import { MaterialStringEditor } from "./inputs/MaterialStringEditor";
import VarbAutoComplete from "./inputs/VarbAutoComplete";

interface Props {
  feId: string;
}

export function CompareTable({ feId }: Props) {
  const table = useTableActor(feId);
  if (!feStoreNameS.is(table.get.selfChildName, "mainTableName")) {
    throw new Error("CompareTable is only for feUser tables");
  }
  const { filteredRows } = table;
  const { isAtLeastOne, areNone } = useHowMany(filteredRows);

  const authStatus = useAuthStatus();

  return (
    <Styled className="CompareTable-root">
      {authStatus === "guest" && (
        <div className="CompareTable-notLoggedIn">
          To view saved analyses, make an account or sign in.
        </div>
      )}
      {auth.isToken && areNone && (
        <div className="CompareTable-areNone">None</div>
      )}
      {auth.isToken && isAtLeastOne && (
        <div className="CompareTable-viewable">
          <div className="CompareTable-titleRow">
            <h5 className="CompareTable-title CompareTable-controlRowItem">
              {"Deals"}
            </h5>
            <div className="CompareTable-controlRow">
              <MaterialStringEditor
                label="Filter by title"
                className="CompareTable-filterEditor CompareTable-controlRowItem"
                feVarbInfo={table.get.varbInfo("titleFilter")}
              />
              <VarbAutoComplete
                onSelect={(o: VariableOption) => table.addColumn(o.varbInfo)}
                placeholder="Add column"
                className="CompareTable-addColumnSelector CompareTable-controlRowItem"
              />
            </div>
          </div>
          <table className="CompareTable-table">
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

  .CompareTable-addColumnSelector {
    .MuiInputBase-root {
      min-width: 130px;
    }
  }

  .CompareTable-title {
    font-size: 2rem;
    color: ${theme["gray-700"]};
  }
  .CompareTable-titleRow {
    display: flex;
    align-items: center;
  }
  .CompareTable-controlRow {
    display: flex;
    align-items: flex-start;
  }

  .CompareTable-trashBtn {
    width: 1.1rem;
    height: 1.1rem;
  }

  .CompareTable-filterEditor {
    .DraftTextField-root {
      min-width: 100px;
    }
  }
  .CompareTable-controlRowItem {
    margin: ${theme.s2};
  }

  .CompareTable-tableCell {
    vertical-align: middle;
  }
  .CompareTable-trashBtn {
    visibility: hidden;
  }

  .CompareTable-viewable {
    border-radius: ${theme.br1};
    border: 2px solid ${theme.deal.border};
    padding: ${theme.s2} 0 0 0;
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
    background: ${theme.deal.light};
  }

  .CompareTable-thContent {
    display: flex;
  }
  .CompareTable-columnArrow {
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
        .CompareTable-trashBtn {
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

  .CompareTable-notLoggedIn,
  .CompareTable-areNone {
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
