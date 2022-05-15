import React from "react";
import styled from "styled-components";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import { FeInfo, InfoS } from "../../sharedWithServer/SectionsMeta/Info";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import ccs from "../../theme/cssChunks";
import theme, {
  ThemeSectionName,
  themeSectionNameOrDefault,
} from "../../theme/Theme";
import useHowMany from "./customHooks/useHowMany";
import RowIndexListRow from "./RowIndexListRow";

function useRowEntries<S extends SectionName<"hasRowIndex">>(
  sectionName: S
): { dbId: string }[] {
  const { analyzer } = useAnalyzerContext();
  const rowIndexName = analyzer.meta.section(sectionName).get("rowIndexName");
  const feIds = analyzer.parent(rowIndexName).childFeIds(rowIndexName);
  const rowEntries = feIds.map((id) => {
    const section = analyzer.section(InfoS.fe(rowIndexName, id));
    return {
      title: section.value("title", "string"),
      dbId: section.dbId,
    };
  });
  return rowEntries.sort((a, b) => {
    return a.title.localeCompare(b.title);
  });
}

type Props = {
  feInfo: FeInfo<"hasRowIndex">;
  className?: string;
};
export function RowIndexRows({ feInfo, className }: Props) {
  const { sectionName } = feInfo;
  const entries = useRowEntries(sectionName);
  const { isAtLeastOne } = useHowMany(entries);

  return (
    <Styled
      className={`RowIndexRows-root ${className}`}
      tabIndex={0}
      sectionName={themeSectionNameOrDefault(sectionName)}
    >
      {isAtLeastOne &&
        entries.map(({ dbId }) => (
          <RowIndexListRow {...{ rowDbId: dbId, indexSourceFinder: feInfo }} />
        ))}
      {!isAtLeastOne && (
        <div className="RowIndexRows-entry">
          <div className="RowIndexSectionList-noneDiv">None</div>
        </div>
      )}
    </Styled>
  );
}

const Styled = styled.div<{ sectionName: ThemeSectionName }>`
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
