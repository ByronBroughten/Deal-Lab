import { TextField } from "@material-ui/core";
import { transparentize } from "polished";
import React from "react";
import styled from "styled-components";
import { SectionNameByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import ccs from "../../theme/cssChunks";
import theme, { ThemeName, themeSectionNameOrDefault } from "../../theme/Theme";
import { useMainSectionActor } from "./../../modules/sectionActorHooks/useMainSectionActor";
import { FeSectionInfo } from "./../../sharedWithServer/SectionsMeta/Info";
import useHowMany from "./customHooks/useHowMany";
import { RowIndexListRow, StyledRowIndexRow } from "./RowIndexListRow";

type Props<SN extends SectionNameByType<"hasIndexStore">> = {
  feInfo: FeSectionInfo<SN>;
  className?: string;
  noEntriesMessage: string;
};
export function RowIndexRows<SN extends SectionNameByType<"hasIndexStore">>({
  feInfo,
  className,
  noEntriesMessage,
}: Props<SN>) {
  const [filter, setFilter] = React.useState("");
  const section = useMainSectionActor(feInfo);
  const rows = section.alphabeticalDisplayItems();
  const { isAtLeastOne } = useHowMany(rows);

  return (
    <Styled
      className={`RowIndexRows-root ${className}`}
      tabIndex={0}
      sectionName={themeSectionNameOrDefault(feInfo.sectionName)}
    >
      {isAtLeastOne && (
        <>
          <TextField
            {...{
              className: "RowIndexRows-filter",
              placeholder: "filter",
              value: filter,
              onChange: ({ currentTarget }) => {
                setFilter(currentTarget.value);
              },
            }}
          />
          {rows.map(
            ({ dbId, displayName }) =>
              displayName.includes(filter) && (
                <RowIndexListRow
                  {...{
                    displayName,
                    load: () => section.loadFromIndex(dbId),
                    del: () => section.deleteFromIndex(dbId),
                    key: dbId,
                  }}
                />
              )
          )}
        </>
      )}
      {!isAtLeastOne && (
        <StyledRowIndexRow className={"RowIndexRows-noEntriesRow"}>
          {noEntriesMessage}
        </StyledRowIndexRow>
      )}
    </Styled>
  );
}

const Styled = styled.div<{ sectionName: ThemeName }>`
  display: block;
  position: relative;
  z-index: 2; // 2 beats editor title labels
  background: ${theme.light};
  border-radius: 0 0 ${theme.br1} ${theme.br1};
  border: 1px solid ${theme["gray-500"]};
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  ${ccs.dropdown.scrollbar};

  .RowIndexRows-filter {
    padding: 0 ${theme.s3} 0 ${theme.s3};
  }

  .RowIndexRows-noEntriesRow {
    white-space: nowrap;
    color: ${transparentize(0.4, theme.softDark)};
    background-color: ${transparentize(0.05, theme.error.light)};
  }

  .RowIndexRows-trashBtn {
    width: 20px;
    height: auto;
  }

  .RowIndexRows-entry:not(:first-child) {
    border-top: 1px solid ${({ sectionName }) => theme[sectionName].light};
  }

  .RowIndexRows-entry {
    display: flex;
    justify-content: space-between;
  }
`;
