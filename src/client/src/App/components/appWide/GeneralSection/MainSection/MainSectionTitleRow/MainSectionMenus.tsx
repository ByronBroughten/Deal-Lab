import styled from "styled-components";
import { useMainSectionActor } from "../../../../../modules/sectionActorHooks/useMainSectionActor";
import { SaveStatus } from "../../../../../modules/SectionSolvers/MainSectionSolver";
import { SectionNameByType } from "../../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { useAuthStatus } from "../../../../../sharedWithServer/stateClassHooks/useAuthStatus";
import theme from "../../../../../theme/Theme";
import { DisplayNameSectionList } from "../../../DisplayNameSectionList";
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
  const authStatus = useAuthStatus();
  const isGuest = authStatus === "guest";
  const section = useMainSectionActor(feInfo);
  const saveStatusDisplayed = showSaveStatus && section.isSaved;
  const { sectionName } = section.get;
  return (
    <Styled className={`MainSectionMenus-root ${className ?? ""}`}>
      {saveStatusDisplayed && (
        <ChangesSyncedStatusBtn
          saveStatus={saveStatus}
          className="MainSectionMenus-item"
        />
      )}
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
      {showLoadList && (
        <DisplayNameSectionList
          {...{
            className: "MainSectionMenus-item",
            feInfo,
            pluralName,
            disabled: isGuest,
            dropTop,
          }}
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
