import React from "react";
import styled, { css } from "styled-components";
import useToggleView from "../../../../modules/customHooks/useToggleView";
import { useMainSectionActor } from "../../../../modules/sectionActorHooks/useMainSectionActor";
import { HasRowFeStore } from "../../../../sharedWithServer/SectionsMeta/SectionName";
import { useAuthStatus } from "../../../../sharedWithServer/stateClassHooks/useAuthStatus";
import theme from "../../../../theme/Theme";
import DisplayNameSectionList from "../../DisplayNameSectionList";
import XBtn from "../../Xbtn";
import { MainSectionTitleRowTitle } from "./MainSectionTitleRow/MainSectionTitleRowTitle";
import { StoreSectionActionMenu } from "./StoreSectionActionMenu";

type Props = {
  sectionName: HasRowFeStore;
  feId: string;
  pluralName: string;
  xBtn?: boolean;
  dropTop?: boolean;
};

export function MainSectionTitleRow({
  pluralName,
  xBtn = false,
  dropTop = false,
  ...feInfo
}: Props) {
  const mainSection = useMainSectionActor(feInfo);
  const authStatus = useAuthStatus();
  const { btnMenuIsOpen } = useToggleView({
    initValue: false,
    viewWhat: "btnMenu",
  });
  const isGuest = authStatus === "guest";
  return (
    <Styled
      className="MainSectionTitleRow-root"
      {...{
        $btnMenuIsOpen: btnMenuIsOpen,
        $dropTop: dropTop,
      }}
    >
      <div className="MainSectionTitleRow-leftSide">
        <MainSectionTitleRowTitle feInfo={feInfo} />
        <div className="MainSectionTitleRow-leftSide-btnsRow">
          <StoreSectionActionMenu
            {...{ ...feInfo, className: "MainsectionTitleRow-dropdownList" }}
          />
          <DisplayNameSectionList
            {...{
              className: "MainSectionTitleRow-flexUnit",
              feInfo,
              pluralName,
              disabled: isGuest,
              dropTop,
            }}
          />
        </div>
      </div>
      <div className="MainSectionTitleRow-rightSide">
        {xBtn && (
          <XBtn
            className="MainSectionTitleRow-xBtn"
            onClick={() => mainSection.removeSelf()}
          />
        )}
      </div>
    </Styled>
  );
}

const Styled = styled.div<{ $btnMenuIsOpen: boolean; $dropTop: boolean }>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  .LabeledIconBtn-root {
    width: 230px;
    height: 30px;
    border-top: 1px solid ${theme["gray-500"]};
    :first-child {
      ${({ $dropTop }) =>
        !$dropTop &&
        css`
          border-top: none;
        `}
    }
  }

  .MainSectionTitleRow-ellipsisBtn {
    color: ${({ $btnMenuIsOpen }) =>
      $btnMenuIsOpen ? theme["gray-600"] : theme.dark};
  }
  .MainsectionTitleRow-dropdownList {
    :not(:first-child) {
      margin-left: ${theme.s3};
    }
  }
  .MainSectionTitleRow-leftSide {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .MainSectionTitleRow-rightSide {
    display: flex;
  }
  .MainSectionTitleRow-title ..DraftTextField-root {
    min-width: 150px;
  }
  .MainSectionTitleRow-leftSide-btnsRow {
    display: flex;
  }
  .MainSectionTitleRow-title,
  .MainSectionTitleRow-leftSide-btnsRow {
    margin: 0 ${theme.s2};
  }

  .MainSectionTitleRow-xBtn {
    margin-left: ${theme.s3};
    height: ${theme.bigButtonHeight};
    width: ${theme.bigButtonHeight};
  }
`;
