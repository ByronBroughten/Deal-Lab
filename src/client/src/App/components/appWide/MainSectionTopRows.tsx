import React from "react";
import styled from "styled-components";
import { SectionNameByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import theme from "../../theme/Theme";
import { MainSectionTitleRow } from "./GeneralSection/MainSection/MainSectionTitleRow";
import { MainSectionActionRow } from "./GeneralSection/MainSection/MainSectionTitleRow/MainSectionActionRow";
import { useSaveStatus } from "./GeneralSection/MainSection/useSaveStatus";
import { RemoveSectionXBtn } from "./RemoveSectionXBtn";
import { SectionTitle } from "./SectionTitle";

type Props = {
  className?: string;
  sectionTitle: string;
  sectionName: SectionNameByType<"hasCompareTable">;
  feId: string;
  loadWhat: string;
  belowTitle?: React.ReactNode;
  showXBtn?: boolean;
  showControls?: boolean;
  rightTop?: React.ReactNode;
};
export function MainSectionTopRows({
  className,
  sectionTitle,
  loadWhat,
  belowTitle,
  showXBtn,
  showControls = true,
  rightTop,
  ...feInfo
}: Props) {
  const saveStatus = useSaveStatus(feInfo);
  return (
    <Styled className={`MainSectionTopRows-root ${className ?? ""}`}>
      <div className="MainSectionTopRows-topRow">
        <div className="MainSectionTopRows-topLeft">
          <SectionTitle
            text={sectionTitle}
            className="MainSectionTopRows-sectionTitle"
          />
          {showControls && (
            <MainSectionTitleRow
              {...{
                ...feInfo,
                sectionTitle,
                className: "MainSectionTopRows-titleRow",
              }}
            />
          )}
        </div>
        <div className="MainSectionTopRows-topRight">
          {rightTop}
          {showControls && showXBtn && (
            <RemoveSectionXBtn
              className="MainSectionTopRows-xBtn"
              {...feInfo}
            />
          )}
        </div>
      </div>
      <div className="MainSectionTopRows-secondRow">
        {showControls && (
          <MainSectionActionRow
            {...{
              ...feInfo,
              loadWhat,
              xBtn: false,
              dropTop: false,
              saveStatus,
              className: "MainSectionTopRows-sectionMenus",
            }}
          />
        )}
      </div>
    </Styled>
  );
}

const Styled = styled.div`
  .MainSectionTopRows-topRow,
  .MainSectionTopRows-secondRow,
  .MainSectionTopRows-topLeft,
  .MainSectionTopRows-topRight {
    display: flex;
  }

  .MainSectionTopRows-topRow {
    display: flex;
    justify-content: space-between;
  }

  .MainSectionTopRows-leftBlock {
    /* width: 130px; */
    color: ${theme.primary};
  }
  .MainSectionTopRows-sectionTitle {
    font-size: 22px;
  }

  .MainSectionTopRows-titleRow {
    margin-left: ${theme.s3};
  }

  .MainSectionTopRows-xBtn {
    height: ${theme.bigButtonHeight};
    width: ${theme.bigButtonHeight};
  }

  .MainSectionTopRows-secondRow {
    margin-top: ${theme.s3};
  }

  .MainSectionTopRows-sectionMenus {
  }
`;
