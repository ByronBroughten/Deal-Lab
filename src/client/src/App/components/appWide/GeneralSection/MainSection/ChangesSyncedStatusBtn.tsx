import React from "react";
import { MdOutlineSync, MdOutlineSyncDisabled } from "react-icons/md";
import styled, { css } from "styled-components";
import { SaveStatus } from "../../../../modules/SectionSolvers/MainSectionSolver";
import theme from "../../../../theme/Theme";
import { ListMenuBtn } from "../../ListGroup/ListGroupShared/ListMenuSimple/ListMenuBtn";

type Props = {
  saveStatus: SaveStatus;
  className?: string;
};
export function ChangesSyncedStatusBtn({ className, saveStatus }: Props) {
  const btnProps = {
    unsaved: {
      $color: theme["gray-500"],
      text: "Loading",
    },
    changesSynced: {
      $color: theme.success,
      get icon() {
        return <MdOutlineSync />;
      },
      text: "Changes Synced",
    },
    unsyncedChanges: {
      $color: theme.primary.border,
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

const Styled = styled(ListMenuBtn)<{ $color: string }>`
  background: transparent;
  ${({ $color }) => css`
    border: 2px solid ${$color};
    color: ${$color};
    font-size: ${theme.labelSize};

    :hover {
      color: ${$color};
      background: transparent;
      cursor: auto;
    }
  `};
`;
