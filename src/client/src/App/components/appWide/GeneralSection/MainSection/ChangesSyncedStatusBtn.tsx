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
      text: "Changes Saved",
    },
    unsyncedChanges: {
      $color: theme.info.border,
      get icon() {
        return <MdOutlineSyncDisabled />;
      },
      text: "Unsaved Changes",
    },
  } as const;
  return (
    <Styled
      {...{
        ...btnProps[saveStatus],
        className: `ChangesSyncedStatusBtn-root ${className ?? ""}`,
      }}
    />
  );
}

const Styled = styled(ListMenuBtn)<{ $color: string }>`
  background: ${theme.light};
  white-space: nowrap;

  ${({ $color }) => css`
    border: 2px solid ${$color};
    color: ${$color};
    font-size: ${theme.labelSize};

    :hover {
      color: ${$color};
      background-color: ${theme.light};
      cursor: auto;
    }
  `};
`;
