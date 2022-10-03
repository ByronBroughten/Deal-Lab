import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import styled from "styled-components";
import {
  useTableActor,
  UseTableActorProps,
} from "../modules/sectionActorHooks/useTableActor";
import { feStoreNameS } from "../sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/FeStoreName";
import { useAuthStatus } from "../sharedWithServer/stateClassHooks/useAuthStatus";
import theme from "../theme/Theme";
import useHowMany from "./appWide/customHooks/useHowMany";
import { CompareTable } from "./CompareTablePage/CompareTable";

function useLoadRows(props: UseTableActorProps) {
  const authStatus = useAuthStatus();
  const table = useTableActor(props);
  const [isLoaded, setIsLoaded] = React.useState(false);
  React.useEffect(() => {
    async function loadRows() {
      unstable_batchedUpdates(async () => {
        await table.getRows();
        setIsLoaded(true);
      });
    }
    if (authStatus !== "guest" && !isLoaded) {
      loadRows();
    }
  });
  return isLoaded;
}

interface Props extends UseTableActorProps {
  title: string;
}
export function CompareTablePage(props: Props) {
  const isLoaded = useLoadRows(props);
  const table = useTableActor(props);
  if (!feStoreNameS.is(table.get.selfChildName, "mainTableName")) {
    throw new Error("CompareTablePage is only for feUser tables");
  }

  const { filteredRows } = table;
  const { isAtLeastOne, areNone } = useHowMany(filteredRows);
  const authStatus = useAuthStatus();
  function getScenarioKey(): keyof typeof scenarios {
    if (authStatus === "guest") return "isGuest";
    else if (!isLoaded) return "isLoading";
    else if (areNone) return "areNone";
    else if (isAtLeastOne) return "isAtLeastOne";
    else throw new Error("One of these should have been true.");
  }
  const scenarios = {
    isGuest: () => (
      <div className="CompareTable-notLoggedIn">
        To view saved analyses, make an account or sign in.
      </div>
    ),
    isLoading: () => <div className="CompareTable-areNone">Loading...</div>,
    areNone: () => <div className="CompareTable-areNone">None</div>,
    isAtLeastOne: () => <CompareTable {...props} />,
  } as const;

  const getScenarioNode = scenarios[getScenarioKey()];
  return <Styled className="CompareTable-root">{getScenarioNode()}</Styled>;
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
