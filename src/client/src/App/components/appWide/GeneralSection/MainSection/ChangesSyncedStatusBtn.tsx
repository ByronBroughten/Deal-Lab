import React from "react";
import { MdOutlineSync, MdOutlineSyncDisabled } from "react-icons/md";
import styled, { css } from "styled-components";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/Info";
import { SectionNameByType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import theme, { ThemeName } from "../../../../theme/Theme";
import { ListMenuBtn } from "../../ListGroup/ListGroupShared/ListMenuSimple/ListMenuBtn";
import { useSaveStatus } from "./useSaveStatus";

type Props<SN extends SectionNameByType<"hasIndexStore">> = {
  feInfo: FeSectionInfo<SN>;
  className?: string;
};
export function ChangesSyncedStatusBtn<
  SN extends SectionNameByType<"hasIndexStore">
>({ feInfo, className }: Props<SN>) {
  const saveStatus = useSaveStatus(feInfo);
  const btnProps = {
    unsaved: {
      $themeName: "default",
      text: "Unsaved",
    },
    changesSynced: {
      $themeName: "plus",
      get icon() {
        return <MdOutlineSync />;
      },
      text: "Changes Synced",
    },
    unsyncedChanges: {
      $themeName: "primary",
      get icon() {
        return <MdOutlineSyncDisabled />;
      },
      text: "Unsynced Changes",
    },
  } as const;
  return (
    <Styled
      {...{
        ...btnProps[saveStatus],
        className: `ChangesSyncedStatusBtn ${className ?? ""}`,
      }}
    />
  );
}

const Styled = styled(ListMenuBtn)<{ $themeName: ThemeName }>`
  background: ${theme["gray-100"]};
  ${({ $themeName }) => css`
    border: 2px solid ${theme[$themeName].border};
    color: ${theme[$themeName].border};
    font-weight: 700;

    :hover {
      color: ${theme[$themeName].border};
      background: transparent;
      cursor: auto;
    }
  `};
`;
