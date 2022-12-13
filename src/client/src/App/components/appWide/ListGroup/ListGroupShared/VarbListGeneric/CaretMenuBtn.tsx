import { BiCaretDown, BiCaretRight, BiCaretUp } from "react-icons/bi";
import { HiMenu } from "react-icons/hi";
import { MdOutlineSync, MdOutlineSyncDisabled } from "react-icons/md";
import styled from "styled-components";
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

const Styled = styled(ListMenuBtn)<{ $saveStatus?: SaveStatus }>`
  border: none !important;
  .CaretMenuBtn-syncedIcon {
    color: ${theme.success};
  }
  .CaretMenuBtn-unsyncedIcon {
    color: ${theme.primary.dark};
  }
`;
