import { Box } from "@mui/material";
import React from "react";
import styled from "styled-components";
import { SectionNameByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import { nativeTheme } from "../../theme/nativeTheme";
import theme from "../../theme/Theme";
import { StoreSectionActions } from "./GeneralSection/MainSection/StoreSectionActions";
import { useSaveStatus } from "./GeneralSection/MainSection/useSaveStatus";
import { RemoveSectionXBtn } from "./RemoveSectionXBtn";
import { SectionTitle } from "./SectionTitle";

type Props = {
  className?: string;
  sectionTitle: string;
  sectionName: SectionNameByType<"mainDealSection">;
  feId: string;
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
      <Box sx={{ flexDirection: "row", mt: nativeTheme.s3 }}>
        {showControls && (
          <StoreSectionActions
            {...{
              ...feInfo,
              saveStatus,
            }}
          />
        )}
      </Box>
    </Styled>
  );
}

const Styled = styled.div`
  padding-bottom: ${theme.s35};

  .MainSectionTopRows-topRow,
  .MainSectionTopRows-topLeft,
  .MainSectionTopRows-topRight {
    display: flex;
  }
  .MainSectionTopRows-topLeft {
    align-items: center;
  }

  .MainSectionTopRows-sectionTitle {
    font-size: 24px;
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
`;
