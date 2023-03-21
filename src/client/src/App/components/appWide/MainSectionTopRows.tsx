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
  sectionName: SectionNameByType<"mainDealSection">;
  feId: string;
  loadWhat: string;
  belowTitle?: React.ReactNode;
  checkmarkStatus?: CheckmarkStatus;
  showXBtn?: boolean;
  showControls?: boolean;
  topRight?: React.ReactNode;
  topLeft?: React.ReactNode;
};

type CheckmarkStatus = "hidden" | "checked" | "unchecked";

export function MainSectionTopRows({
  className,
  sectionTitle,
  loadWhat,
  belowTitle,
  checkmarkStatus = "hidden",
  showXBtn,
  showControls = true,
  topRight,
  topLeft,
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
          {topLeft}
        </div>
        <div className="MainSectionTopRows-topRight">
          {topRight}
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
  padding-bottom: ${theme.s35};

  .MainSectionTopRows-topRow,
  .MainSectionTopRows-secondRow,
  .MainSectionTopRows-topLeft,
  .MainSectionTopRows-topRight {
    display: flex;
  }
  .MainSectionTopRows-topLeft {
    align-items: center;
  }

  .MainSectionTopRows-secondRow {
    margin-top: ${theme.s25};
  }

  .MainSectionTopRows-sectionTitle {
    font-size: 22px;
    margin-right: ${theme.s3};
  }

  .MainSectionTopRows-topRight {
    align-items: flex-start;
  }

  .MainSectionTopRows-topLeft {
    flex-wrap: wrap;
  }

  .MainSectionTopRows-topRow {
    display: flex;
    justify-content: space-between;
  }

  .MainSectionTopRows-xBtn {
    height: ${theme.bigButtonHeight};
    width: ${theme.bigButtonHeight};
  }

  .MainSectionTopRows-sectionMenus {
  }
`;
