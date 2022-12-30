import { BiCaretDown, BiCaretRight, BiCaretUp } from "react-icons/bi";
import { BsCloudCheck, BsCloudSlash } from "react-icons/bs";
import { HiMenu } from "react-icons/hi";
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
export function CaretSyncMenuBtn({
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
            <BsCloudCheck className="CaretSyncMenuBtn-syncedIcon" />
          )}
          {!dropped && saveStatus === "unsyncedChanges" && (
            <BsCloudSlash className="CaretSyncMenuBtn-unsyncedIcon" />
          )}
          <HiMenu className="CaretSyncMenuBtn-menuIcon" />
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
  .CaretSyncMenuBtn-syncedIcon {
    color: ${theme.success};
  }
  .CaretSyncMenuBtn-unsyncedIcon {
    color: ${theme.info.dark};
  }
  ${({ $dropped }) =>
    $dropped &&
    css`
      background-color: ${theme.primaryNext};
      color: ${theme.white};
    `}
`;
