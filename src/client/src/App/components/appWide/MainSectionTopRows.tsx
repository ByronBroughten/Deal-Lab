import { Box } from "@mui/material";
import React from "react";
import styled from "styled-components";
import { SectionNameByType } from "../../../sharedWithServer/SectionNameByType";
import theme from "../../theme/Theme";
import { nativeTheme } from "../../theme/nativeTheme";
import { useIsDevices } from "../customHooks/useMediaQueries";
import { MuiRow } from "../general/MuiRow";
import { StoreSectionActions } from "./GeneralSection/MainSection/StoreSectionActions";
import { PageTitle } from "./PageTitle";
import { RemoveSectionXBtn } from "./RemoveSectionXBtn";
import { TitleAppend } from "./titleAppend";

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
  const { isPhone } = useIsDevices();
  return (
    <Styled className={`MainSectionTopRows-root ${className ?? ""}`}>
      <div className="MainSectionTopRows-topRow">
        <MuiRow
          sx={{
            ...(isPhone && { marginLeft: nativeTheme.s15 }),
          }}
        >
          <PageTitle sx={{ mr: nativeTheme.s3 }} text={sectionTitle} />
          {titleAppend && <TitleAppend children={titleAppend} />}
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
