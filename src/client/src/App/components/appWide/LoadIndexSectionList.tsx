import React from "react";
import styled from "styled-components";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import { useSectionQueryActions } from "../../modules/useQueryActions/useSectionQueryActions";
import { sectionMetas } from "../../sharedWithServer/SectionMetas";
import { FeInfo, InfoS } from "../../sharedWithServer/SectionMetas/Info";
import { ChildName } from "../../sharedWithServer/SectionMetas/relSectionTypes/ChildTypes";
import { IndexParentName } from "../../sharedWithServer/SectionMetas/relSectionTypes/StoreTypes";
import {
  SectionName,
  sectionNameS,
} from "../../sharedWithServer/SectionMetas/SectionName";
import ccs from "../../theme/cssChunks";
import theme, {
  ThemeSectionName,
  themeSectionNameOrDefault,
} from "../../theme/Theme";
import TrashBtn from "../general/TrashBtn";
import useHowMany from "./customHooks/useHowMany";
import LoadIndexSectionBtn from "./IndexSectionList/LoadIndexSectionBtn";

function useDeleteIndexSection(
  sectionName: SectionName<"hasIndexStore">
): (dbId: string) => void {
  const store = useSectionQueryActions();
  if (sectionNameS.is(sectionName, "hasRowIndexStore")) {
    return async (dbId: string) =>
      await store.deleteRowIndexEntry(sectionName, dbId);
  } else {
    return async (dbId: string) =>
      await store.deleteIndexEntry(sectionName, dbId);
  }
}

function useIndexedEntries<S extends SectionName<"hasIndexStore">>(
  sectionName: S
): { dbId: string; title: string }[] {
  const { analyzer } = useAnalyzerContext();

  const storeName = sectionMetas.get(sectionName).get("indexStoreName");
  const feStoreParentName = sectionMetas.parentName(
    storeName
  ) as IndexParentName<S>;

  const section = analyzer.section(feStoreParentName);
  const feIds = section.childFeIds(
    storeName as ChildName<typeof feStoreParentName>
  );

  const indexedEntries = feIds.map((id) => {
    const section = analyzer.section(InfoS.fe(storeName, id));
    return {
      title: section.value("title", "string"),
      dbId: section.dbId,
    };
  });

  return indexedEntries.sort((a, b) => {
    return a.title.localeCompare(b.title);
  });
}

type Props = {
  feInfo: FeInfo<"hasIndexStore">;
  className?: string;
};
export function LoadIndexSectionList({ feInfo, className }: Props) {
  const { sectionName } = feInfo;
  const entries = useIndexedEntries(sectionName);
  const deleteIndexSection = useDeleteIndexSection(sectionName);
  const { isAtLeastOne } = useHowMany(entries);

  return (
    <Styled
      className={`LoadIndexSectionList-root ${className}`}
      tabIndex={0}
      sectionName={themeSectionNameOrDefault(sectionName)}
    >
      {isAtLeastOne &&
        entries.map(({ dbId, title }) => (
          <div key={dbId} className="LoadIndexSectionList-entry">
            <LoadIndexSectionBtn {...{ feInfo, dbId, title }} />
            <TrashBtn
              className="LoadIndexSectionList-trashBtn"
              onClick={() => deleteIndexSection(dbId)}
            />
          </div>
        ))}
      {!isAtLeastOne && (
        <div className="LoadIndexSectionList-entry">
          <div className="IndexSectionList-noneDiv">None</div>
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

  .IndexSectionList-noneDiv {
    padding: ${theme.s2};
  }

  .LoadIndexSectionList-trashBtn {
    width: 20px;
    height: auto;
  }

  .LoadIndexSectionList-entry:not(:first-child) {
    border-top: 1px solid ${({ sectionName }) => theme[sectionName].light};
  }

  .LoadIndexSectionList-entry {
    display: flex;
    justify-content: space-between;
  }
`;
