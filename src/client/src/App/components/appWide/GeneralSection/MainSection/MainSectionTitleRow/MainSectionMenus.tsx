import styled from "styled-components";
import { constants } from "../../../../../Constants";
import { useMainSectionActor } from "../../../../../modules/sectionActorHooks/useMainSectionActor";
import {
  SectionNameByType,
  sectionNameS,
} from "../../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { useAuthStatus } from "../../../../../sharedWithServer/stateClassHooks/useAuthStatus";
import theme from "../../../../../theme/Theme";
import { DisplayNameSectionList } from "../../../DisplayNameSectionList";
import ListMenuBtn from "../../../ListGroup/ListGroupShared/ListMenuSimple/ListMenuBtn";
import { StoreSectionActionMenu } from "../StoreSectionActionMenu";
import { ActionMenuProps } from "../StoreSectionActionMenu/ActionMenuTypes";
import { StoreSectionSaveStatus } from "./../StoreSectionSaveStatus";

export interface MainSectionMenuOptions {
  xBtn?: boolean;
  dropTop?: boolean;
  actionMenuProps?: ActionMenuProps;
  showActions?: boolean;
  showLoadList?: boolean;
  showSaveStatus?: boolean;
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
        <StoreSectionSaveStatus
          feInfo={feInfo}
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
      {sectionNameS.is(sectionName, "hasCompareTable") && (
        <ListMenuBtn
          {...{
            className: "MainSectionMenus-item",
            href: constants.feRoutes.mainTables[sectionName],
          }}
        >
          {"Compare"}
        </ListMenuBtn>
      )}
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  .MainSectionMenus-item {
    :not(:first-child) {
      margin-left: ${theme.s3};
    }
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
