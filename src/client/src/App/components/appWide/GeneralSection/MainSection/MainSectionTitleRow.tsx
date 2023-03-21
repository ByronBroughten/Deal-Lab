import React from "react";
import styled, { css } from "styled-components";
import { SectionNameByType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import theme from "../../../../theme/Theme";
import { RemoveSectionXBtn } from "../../RemoveSectionXBtn";
import { ChangesSyncedStatusBtn } from "./ChangesSyncedStatusBtn";
import { MainSectionTitleEditor } from "./MainSectionTitleRow/MainSectionTitleEditor";
import { SectionTitleRow } from "./SectionTitleRow";
import { useSaveStatus } from "./useSaveStatus";

type Props = {
  sectionTitle: string;
  sectionName: SectionNameByType<"mainDealSection">;
  feId: string;
  showXBtn?: boolean;
  dropTop?: boolean;
  className?: string;
  showSectionMenus?: boolean;
};
export function MainSectionTitleRow({
  sectionTitle,
  showXBtn = false,
  showSectionMenus = true,
  dropTop = false,
  className,
  ...feInfo
}: Props) {
  const saveStatus = useSaveStatus(feInfo);
  return (
    <Styled
      {...{
        sectionTitle,
        $dropTop: dropTop,
        className: `MainSectionTitleRow-root ${className ?? ""}`,
        leftSide: showSectionMenus && (
          <div className="MainSectionTitleRow-leftSide">
            <MainSectionTitleEditor
              className="ActiveDeal-mainSectionTitleEditor"
              feInfo={feInfo}
            />
            {saveStatus !== "unsaved" && (
              <ChangesSyncedStatusBtn
                saveStatus={saveStatus}
                className="MainSectionTitleRow-snycStatus"
              />
            )}
          </div>
        ),
        rightSide: showXBtn && (
          <RemoveSectionXBtn className="MainSectionTitleRow-xBtn" {...feInfo} />
        ),
      }}
    />
  );
}

const Styled = styled(SectionTitleRow)<{ $dropTop: boolean }>`
  .MainSectionTitleRow-leftSide {
    display: flex;
    align-items: flex-end;
  }

  .MainSectionTitleRow-snycStatus {
    margin-left: ${theme.s2};
  }

  .MainSectionTitleRow-btnsRow-LeftSide {
    display: flex;
    border-radius: ${theme.br0};
    .ListMenuBtn-root {
      width: 100px;
    }
    .ChangesSyncedStatusBtn-root {
      width: auto;
    }
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

  .MainSectionTitleRow-xBtn {
    margin-left: ${theme.s3};
    height: ${theme.bigButtonHeight};
    width: ${theme.bigButtonHeight};
  }
`;
