import React from "react";
import styled, { css } from "styled-components";
import useToggleView from "../../../../modules/customHooks/useToggleView";
import { SectionNameByType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import theme from "../../../../theme/Theme";
import { RemoveSectionXBtn } from "../../RemoveSectionXBtn";
import { SectionTitle } from "../../SectionTitle";
import { MainSectionMenus } from "./MainSectionTitleRow/MainSectionMenus";
import { useSaveStatus } from "./useSaveStatus";

type Props = {
  sectionTitle?: string;
  sectionName: SectionNameByType<"hasCompareTable">;
  feId: string;
  pluralName: string;
  xBtn?: boolean;
  dropTop?: boolean;
  className?: string;
  showSectionMenus?: boolean;
};
export function MainSectionTitleRow({
  sectionTitle,
  pluralName,
  xBtn = false,
  showSectionMenus = true,
  dropTop = false,
  className,
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
      className={`MainSectionTitleRow-root ${className ?? ""}`}
      {...{
        $btnMenuIsOpen: btnMenuIsOpen,
        $dropTop: dropTop,
      }}
    >
      <div className="MainSectionTitleRow-leftSide">
        {sectionTitle && (
          <SectionTitle
            text={sectionTitle}
            className="MainSectionTitleRow-sectionTitle"
          />
        )}
        {showSectionMenus && (
          <MainSectionMenus
            {...{
              ...feInfo,
              pluralName,
              xBtn,
              dropTop,
              saveStatus,
              className: "MainSectionTitleRow-leftSide-btnsRow",
            }}
          />
        )}
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
  .ListMenuBtn-root {
    width: 100px;
  }
  .MainSectionTitleRow-sectionTitle {
    display: flex;
    align-items: center;
  }
  .MainSectionTitleRow-leftSide-btnsRow {
    display: flex;
    background-color: ${theme.tertiary};
    border-radius: ${theme.br0};
    margin-left: ${theme.s3};
  }

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
  }
`;
