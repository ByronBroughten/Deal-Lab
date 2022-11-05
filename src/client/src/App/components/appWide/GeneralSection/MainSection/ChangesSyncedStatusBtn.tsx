import React from "react";
import { MdOutlineSync, MdOutlineSyncDisabled } from "react-icons/md";
import styled, { css } from "styled-components";
import { SaveStatus } from "../../../../modules/SectionSolvers/MainSectionSolver";
import theme, { ThemeName } from "../../../../theme/Theme";
import { ListMenuBtn } from "../../ListGroup/ListGroupShared/ListMenuSimple/ListMenuBtn";

type Props = {
  saveStatus: SaveStatus;
  className?: string;
};
export function ChangesSyncedStatusBtn({ className, saveStatus }: Props) {
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
