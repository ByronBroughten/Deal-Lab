import { Box } from "@mui/material";
import React from "react";
import styled from "styled-components";
import { SectionNameByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import { nativeTheme } from "../../theme/nativeTheme";
import theme from "../../theme/Theme";
import { MuiRow } from "../general/MuiRow";
import { StoreSectionActions } from "./GeneralSection/MainSection/StoreSectionActions";
import { RemoveSectionXBtn } from "./RemoveSectionXBtn";
import { SectionTitleMain } from "./SectionTitleMain";

type Props = {
  className?: string;
  sectionTitle: string;
  titleAppend?: string;
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
  titleAppend,
  belowTitle,
  checkmarkStatus = "hidden",
  showXBtn,
  showControls = true,
  topRight,
  topLeft,
  ...feInfo
}: Props) {
  return (
    <Styled className={`MainSectionTopRows-root ${className ?? ""}`}>
      <div className="MainSectionTopRows-topRow">
        <MuiRow>
          <SectionTitleMain sx={{ mr: nativeTheme.s3 }} text={sectionTitle} />
          {titleAppend && (
            <Box
              sx={{
                fontSize: nativeTheme.fs17,
                color: nativeTheme["gray-700"],
              }}
            >
              {titleAppend}
            </Box>
          )}
          {topLeft}
        </MuiRow>
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
        {showControls && <StoreSectionActions {...feInfo} />}
      </Box>
    </Styled>
  );
}

const Styled = styled.div`
  padding-bottom: ${theme.s35};

  .MainSectionTopRows-topRow,
  .MainSectionTopRows-topRight {
    display: flex;
  }

  .MainSectionTopRows-topRight {
    align-items: flex-start;
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
