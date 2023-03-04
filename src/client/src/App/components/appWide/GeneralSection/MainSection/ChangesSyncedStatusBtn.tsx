import { BsCloudCheck, BsCloudSlash } from "react-icons/bs";
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
        return <BsCloudCheck />;
      },
      text: "Changes Saved",
    },
    unsyncedChanges: {
      $color: theme.info.border,
      get icon() {
        return <BsCloudSlash />;
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
  background: transparent;
  white-space: nowrap;
  font-size: ${theme.labelSize};

  ${({ $color }) => css`
    border: none;
    color: ${$color};
    font-size: ${theme.labelSize};

    :hover {
      color: ${$color};
      background-color: ${theme.light};
      cursor: auto;
    }
  `};
`;
