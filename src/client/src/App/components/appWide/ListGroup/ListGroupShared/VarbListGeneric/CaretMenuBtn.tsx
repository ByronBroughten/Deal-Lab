import { BiCaretDown, BiCaretRight, BiCaretUp } from "react-icons/bi";
import { HiMenu } from "react-icons/hi";
import { MdOutlineSync, MdOutlineSyncDisabled } from "react-icons/md";
import styled, { css } from "styled-components";
import { SaveStatus } from "../../../../../modules/SectionSolvers/MainSectionSolver";
import theme from "../../../../../theme/Theme";
import { ListMenuBtn } from "../ListMenuSimple/ListMenuBtn";

type BiCaretBtnProps = {
  dropped: boolean;
  onClick: () => void;
  className?: string;
  direction?: "up" | "right";
  saveStatus?: SaveStatus;
  showSaveStatus?: boolean;
};
export function CaretMenuBtn({
  dropped,
  direction = "up",
  saveStatus,
  ...rest
}: BiCaretBtnProps) {
  const directions = {
    get up() {
      return <BiCaretUp />;
    },
    get right() {
      return <BiCaretRight />;
    },
  } as const;
  return (
    <Styled
      {...rest}
      $saveStatus={saveStatus}
      $dropped={dropped}
      icon={
        <>
          {!dropped && saveStatus === "changesSynced" && (
            <MdOutlineSync className="CaretMenuBtn-syncedIcon" />
          )}
          {!dropped && saveStatus === "unsyncedChanges" && (
            <MdOutlineSyncDisabled className="CaretMenuBtn-unsyncedIcon" />
          )}
          <HiMenu className="CaretMenuBtn-menuIcon" />
          {dropped && directions[direction]}
          {!dropped && <BiCaretDown />}
        </>
      }
    />
  );
}

const Styled = styled(ListMenuBtn)<{
  $dropped: boolean;
  $saveStatus?: SaveStatus;
}>`
  border: none !important;
  .CaretMenuBtn-syncedIcon {
    color: ${theme.success};
  }
  .CaretMenuBtn-unsyncedIcon {
    color: ${theme.info.dark};
  }
  ${({ $dropped }) =>
    $dropped &&
    css`
      background-color: ${theme.primaryNext};
      color: ${theme.white};
    `}
`;
