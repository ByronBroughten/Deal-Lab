import styled from "styled-components";
import { useMainSectionActor } from "../../../../../modules/sectionActorHooks/useMainSectionActor";
import { SaveStatus } from "../../../../../modules/SectionSolvers/MainSectionSolver";
import { SectionNameByType } from "../../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import theme from "../../../../../theme/Theme";
import { ChangesSyncedStatusBtn } from "../ChangesSyncedStatusBtn";
import { StoreSectionActionMenu } from "../StoreSectionActionMenu";
import { ActionMenuProps } from "../StoreSectionActionMenu/ActionMenuTypes";

export interface MainSectionMenuOptions {
  xBtn?: boolean;
  dropTop?: boolean;
  actionMenuProps?: ActionMenuProps;
  showActions?: boolean;
  showLoadList?: boolean;
  showSaveStatus?: boolean;
  saveStatus: SaveStatus;
}

interface Props extends MainSectionMenuOptions {
  sectionName: SectionNameByType<"hasIndexStore">;
  feId: string;
  pluralName: string;
  className?: string;
}
export function MainSectionMenus({
  pluralName,
  xBtn,
  dropTop,
  className,
  showActions = true,
  showLoadList = true,
  showSaveStatus = true,
  actionMenuProps,
  saveStatus,
  ...feInfo
}: Props) {
  const section = useMainSectionActor(feInfo);
  const saveStatusDisplayed = showSaveStatus && section.isSaved;
  return (
    <Styled className={`MainSectionMenus-root ${className ?? ""}`}>
      {showActions && (
        <StoreSectionActionMenu
          {...{
            ...feInfo,
            ...actionMenuProps,
            dropTop,
            className: "MainSectionMenus-item",
          }}
        />
      )}
      {saveStatusDisplayed && (
        <ChangesSyncedStatusBtn
          saveStatus={saveStatus}
          className="MainSectionMenus-item"
        />
      )}
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;

  .MainSectionMenus-item {
    :not(:first-child) {
      margin-left: ${theme.s25};
    }
  }
  .MainSectionMenus-compareIcon {
    height: 24px;
    width: 24px;
  }
`;

export const MainSectionMenusMini = styled(MainSectionMenus)`
  .MainSectionMenus-item {
    :not(:first-child) {
      margin-left: 0;
    }
  }

  .MainSectionMenus-item {
    margin-right: ${theme.s2};
  }
  .ListMenuBtn-root {
    height: ${theme.smallButtonHeight};
  }
`;
