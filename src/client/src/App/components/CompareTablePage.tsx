import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import styled from "styled-components";
import {
  useTableActor,
  UseTableActorProps,
} from "../modules/sectionActorHooks/useTableActor";
import { feStoreNameS } from "../sharedWithServer/SectionsMeta/relSectionsDerived/FeStoreName";
import { useAuthStatus } from "../sharedWithServer/stateClassHooks/useAuthStatus";
import theme, { ThemeName } from "../theme/Theme";
import useHowMany from "./appWide/customHooks/useHowMany";
import { CompareTable } from "./CompareTablePage/CompareTable";
import { SidebarContainer } from "./general/SidebarContainer";

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
  $themeName?: ThemeName;
}
export function CompareTablePage({ $themeName, title, ...props }: Props) {
  const isLoaded = useLoadRows(props);
  const table = useTableActor(props);
  if (!feStoreNameS.is(table.get.selfChildName, "mainTableName")) {
    throw new Error("CompareTablePage is only for feUser tables");
  }

  const { areNone } = useHowMany(table.rows);

  const authStatus = useAuthStatus();
  function getScenarioKey(): keyof typeof scenarios {
    if (authStatus === "guest") return "isGuest";
    else if (!isLoaded) return "isLoading";
    else if (areNone) return "areNone";
    else return "showTable";
  }
  const scenarios = {
    isGuest: () => (
      <div className="CompareTablePage-message">
        Log in to save and compare deals.
      </div>
    ),
    isLoading: () => <div className="CompareTablePage-message">Loading...</div>,
    showTable: () => <CompareTable {...props} />,
    areNone: () => (
      <div className="CompareTablePage-message">
        You have no saved deals. Save some then compare them here.
      </div>
    ),
  } as const;

  const getScenarioNode = scenarios[getScenarioKey()];
  return (
    <SidebarContainer activeBtnName="compare">
      <Styled
        {...{
          $themeName,
          className: "CompareTablePage-root",
        }}
      >
        <h5 className="CompareTablePage-title">{title}</h5>
        <div className="CompareTablePage-body">{getScenarioNode()}</div>
      </Styled>
    </SidebarContainer>
  );
}

const Styled = styled.div<{ $themeName?: ThemeName }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  overflow: auto;
  padding-top: ${theme.s4};
  background-color: ${theme.mainBackground};
  min-height: 93vh;

  .CompareTablePage-areNone {
    text-align: center;
    padding: ${theme.s3};
  }

  .CompareTablePage-body {
    margin-top: ${theme.s4};
    border-radius: ${theme.br0};
    border: 2px solid ${theme.primaryNext};
    background: ${theme.light};
  }

  .CompareTable-addColumnSelector {
    .MuiInputBase-root {
      min-width: 130px;
    }
  }

  .CompareTablePage-title {
    font-size: 2rem;
    color: ${theme.dark};
    margin: ${theme.s2};
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

  .CompareTable-tableCell {
    vertical-align: middle;
  }
  .CompareTable-trashBtn {
    visibility: hidden;
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
    border-bottom: 1px solid ${theme.primaryNext};
  }

  td,
  th {
    padding: 0 ${theme.s2} 0 ${theme.s2};
  }

  th {
    vertical-align: bottom;
    white-space: nowrap;
  }

  td {
    padding-top: ${theme.s1};
    padding-left: ${theme.s3};
    vertical-align: top;
    text-align: left;
  }

  .CompareTablePage-message {
    padding: ${theme.s3};
    display: flex;
    justify-content: center;
  }
`;
