import { TextField } from "@mui/material";
import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { AiOutlineInfoCircle } from "react-icons/ai";
import styled from "styled-components";
import { useMainSectionActor } from "../../modules/sectionActorHooks/useMainSectionActor";
import { FeSectionInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionNameByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import { useAuthStatus } from "../../sharedWithServer/stateClassHooks/useAuthStatus";
import ccs from "../../theme/cssChunks";
import theme, { ThemeName, themeSectionNameOrDefault } from "../../theme/Theme";
import useHowMany from "./customHooks/useHowMany";
import { RowIndexListRow, StyledRowIndexRow } from "./RowIndexListRow";

type Props<SN extends SectionNameByType<"hasIndexStore">> = {
  feInfo: FeSectionInfo<SN>;
  loadMode: "load" | "loadAndCopy";
  className?: string;
  onClick?: () => void;
};

type ScenarioKey = "areNone" | "isAtLeastOne";
function useScenarioKey(rows: any[]): ScenarioKey {
  const { areNone } = useHowMany(rows);
  if (areNone) return "areNone";
  else return "isAtLeastOne";
}

export function SectionIndexRows<
  SN extends SectionNameByType<"hasIndexStore">
>({ feInfo, className, onClick, loadMode }: Props<SN>) {
  const authStatus = useAuthStatus();
  const [filter, setFilter] = React.useState("");
  const section = useMainSectionActor(feInfo);
  const rows = section.alphabeticalDisplayItems();
  const scenarioKey = useScenarioKey(rows);

  const loadMethod = {
    load: (dbId: string) => section.loadFromIndex(dbId),
    loadAndCopy: (dbId: string) => section.loadAndCopy(dbId),
  };

  const scenarios = {
    get areNone() {
      return <Message message="None Saved" />;
    },
    get isAtLeastOne() {
      return (
        <>
          <TextField
            hiddenLabel
            {...{
              size: "small",
              className: "SectionIndexRows-filter",
              placeholder: "Filter",
              variant: "filled",
              value: filter,
              onChange: ({ currentTarget }) => {
                setFilter(currentTarget.value);
              },
            }}
          />
          <div>
            {rows.map(
              ({ dbId, displayName }) =>
                displayName.includes(filter) && (
                  <RowIndexListRow
                    {...{
                      displayName,
                      load: () => {
                        unstable_batchedUpdates(() => {
                          loadMethod[loadMode ?? "load"](dbId);
                          onClick && onClick();
                        });
                      },
                      del:
                        authStatus === "guest"
                          ? undefined
                          : () => section.deleteFromIndex(dbId),
                      key: dbId,
                    }}
                  />
                )
            )}
          </div>
        </>
      );
    },
  };

  return (
    <Styled
      className={`SectionIndexRows-root ${className}`}
      tabIndex={0}
      sectionName={themeSectionNameOrDefault(feInfo.sectionName)}
    >
      {scenarios[scenarioKey]}
    </Styled>
  );
}

function Message({ message }: { message: string }) {
  return (
    <StyledRowIndexRow className={"SectionIndexRows-noEntriesRow"}>
      <AiOutlineInfoCircle size={25} />
      <span className="SectionIndexRows-noEntriesMessage">{message}</span>
    </StyledRowIndexRow>
  );
}

const Styled = styled.div<{ sectionName: ThemeName }>`
  display: block;
  position: relative;
  z-index: 2; // 2 beats editor title labels
  background: ${theme.light};
  border-radius: ${theme.br0};
  border: 1px solid ${theme["gray-500"]};
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  ${ccs.dropdown.scrollbar};

  .SectionIndexRows-noEntriesRow {
    display: flex;
    align-items: center;
    white-space: nowrap;
    padding: ${theme.s15} ${theme.s3};
    color: ${theme["gray-600"]};
    background-color: ${theme.info.light};
  }
  .SectionIndexRows-noEntriesMessage {
    margin-left: ${theme.s25};
  }

  .SectionIndexRows-trashBtn {
    width: 20px;
    height: auto;
  }

  .RowIndexListRow-root {
    :not(:first-child) {
      border-top: 1px solid ${theme.primaryBorder};
    }
  }

  .RowIndexListRow-root {
    display: flex;
    justify-content: space-between;
    min-height: 33px;
  }
`;
