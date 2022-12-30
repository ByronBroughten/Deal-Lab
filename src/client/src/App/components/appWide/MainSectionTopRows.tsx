import React from "react";
import styled from "styled-components";
import { SectionNameByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import theme from "../../theme/Theme";
import { MainSectionTitleRow } from "./GeneralSection/MainSection/MainSectionTitleRow";
import { MainSectionActionRow } from "./GeneralSection/MainSection/MainSectionTitleRow/MainSectionActionRow";
import { useSaveStatus } from "./GeneralSection/MainSection/useSaveStatus";
import { SectionTitle } from "./SectionTitle";

type Props = {
  className?: string;
  sectionTitle: string;
  sectionName: SectionNameByType<"hasCompareTable">;
  feId: string;
  loadWhat: string;
  belowTitle?: React.ReactNode;
};
export function MainSectionTopRows({
  className,
  sectionTitle,
  loadWhat,
  belowTitle,
  ...feInfo
}: Props) {
  const saveStatus = useSaveStatus(feInfo);
  return (
    <Styled className={`MainSectionTopRows-root ${className ?? ""}`}>
      <div className="MainSectionTopRows-leftBlock">
        <SectionTitle
          text={sectionTitle}
          className="MainSectionTopRows-sectionTitle"
        />
        {belowTitle ?? null}
      </div>
      <div className="MainSectionTopRows-controls">
        <MainSectionTitleRow
          {...{
            ...feInfo,
            sectionTitle,
            className: "MainSectionTopRows-titleRow",
          }}
        />
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
      </div>
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  align-items: center;
  .MainSectionTopRows-leftBlock {
    width: 100px;
    color: ${theme.primary};
  }
  .MainSectionTopRows-sectionTitle {
    font-size: ${theme.siteTitleSize};
  }
  .MainSectionTopRows-controls {
    margin-left: ${theme.s2};
  }
  .MainSectionTopRows-sectionMenus {
    margin-top: ${theme.s25};
  }
`;
