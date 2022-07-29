import React from "react";
import styled from "styled-components";
import ccs from "../../theme/cssChunks";
import theme, { ThemeName, themeSectionNameOrDefault } from "../../theme/Theme";
import { useMainSectionActor } from "./../../modules/sectionActorHooks/useMainSectionActor";
import { FeInfoByType } from "./../../sharedWithServer/SectionsMeta/Info";
import useHowMany from "./customHooks/useHowMany";
import { RowIndexListRow } from "./RowIndexListRow";

type Props = {
  feInfo: FeInfoByType<"hasRowIndex">;
  className?: string;
};
export function RowIndexRows({ feInfo, className }: Props) {
  const section = useMainSectionActor(feInfo);
  const rows = section.table.alphabeticalGetterRows();
  const { isAtLeastOne } = useHowMany(rows);
  return (
    <Styled
      className={`RowIndexRows-root ${className}`}
      tabIndex={0}
      sectionName={themeSectionNameOrDefault(feInfo.sectionName)}
    >
      {isAtLeastOne &&
        rows.map(({ dbId, displayName }) => (
          <RowIndexListRow
            {...{
              displayName,
              load: () => section.loadFromIndex(dbId),
              del: () => section.deleteFromIndex(dbId),
              key: dbId,
            }}
          />
        ))}
      {!isAtLeastOne && (
        <div className="RowIndexRows-entry">
          <div className="RowIndexSectionList-noneDiv">None</div>
        </div>
      )}
    </Styled>
  );
}

const Styled = styled.div<{ sectionName: ThemeName }>`
  display: block;
  position: absolute;
  z-index: 2; // 2 beats editor title labels
  background: ${theme.light};
  border-radius: 0 0 ${theme.br1} ${theme.br1};
  border: 1px solid ${theme["gray-500"]};
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  ${ccs.dropdown.scrollbar};

  .RowIndexSectionList-noneDiv {
    padding: ${theme.s2};
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
