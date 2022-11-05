import React from "react";
import styled, { css } from "styled-components";
import useToggleView from "../../../../modules/customHooks/useToggleView";
import { SectionNameByType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import theme from "../../../../theme/Theme";
import { CaretMenuBtn } from "../../ListGroup/ListGroupShared/VarbListGeneric/CaretMenuBtn";
import { RemoveSectionXBtn } from "../../RemoveSectionXBtn";
import { MainSectionMenus } from "./MainSectionTitleRow/MainSectionMenus";
import { MainSectionTitleRowTitle } from "./MainSectionTitleRow/MainSectionTitleRowTitle";
import { useSaveStatus } from "./useSaveStatus";

type Props = {
  sectionName: SectionNameByType<"hasCompareTable">;
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
  const { btnMenuIsOpen } = useToggleView({
    initValue: false,
    viewWhat: "btnMenu",
  });

  const { toggleMenuBtns, menuBtnsIsOpen } = useToggleView({
    initValue: false,
    viewWhat: "menuBtns",
  });
  const saveStatus = useSaveStatus(feInfo);
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
          <CaretMenuBtn
            {...{
              saveStatus,
              className: "MainSectionTitleRow-caretBtn",
              dropped: menuBtnsIsOpen,
              onClick: toggleMenuBtns,
              direction: "right",
            }}
          />
          {menuBtnsIsOpen && (
            <MainSectionMenus
              {...{
                ...feInfo,
                pluralName,
                xBtn,
                dropTop,
                saveStatus,
              }}
            />
          )}
        </div>
      </div>
      <div className="MainSectionTitleRow-rightSide">
        {xBtn && (
          <RemoveSectionXBtn className="MainSectionTitleRow-xBtn" {...feInfo} />
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
    :first-child {
      ${({ $dropTop }) =>
        !$dropTop &&
        css`
          border-top: none;
        `}
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
  .MainSectionTitleRow-title,
  .DraftTextField-root {
    min-width: 150px;
  }
  .MainSectionTitleRow-title,
  .MainSectionTitleRow-leftSide-btnsRow {
    display: flex;
    margin: 0 ${theme.s2};
  }

  .MainSectionTitleRow-leftSide-btnsRow {
    background-color: ${theme["gray-400"]};
    border-radius: ${theme.br1};
  }

  .MainSectionTitleRow-xBtn {
    margin-left: ${theme.s3};
    height: ${theme.bigButtonHeight};
    width: ${theme.bigButtonHeight};
  }

  .MainSectionMenus-root {
    padding: ${theme.s15};
    border: ${theme.transparentGrayBorder};
  }

  .MainSectionTitleRow-caretBtn {
    height: 36px;
  }
`;
