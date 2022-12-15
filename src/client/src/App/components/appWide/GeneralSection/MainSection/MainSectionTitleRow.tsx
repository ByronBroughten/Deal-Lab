import React from "react";
import styled, { css } from "styled-components";
import { SectionNameByType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import theme from "../../../../theme/Theme";
import { RemoveSectionXBtn } from "../../RemoveSectionXBtn";
import { MainSectionMenus } from "./MainSectionTitleRow/MainSectionMenus";
import { SectionTitleRow } from "./SectionTitleRow";
import { useSaveStatus } from "./useSaveStatus";

type Props = {
  sectionTitle: string;
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
  const saveStatus = useSaveStatus(feInfo);
  return (
    <Styled
      {...{
        sectionTitle,
        $dropTop: dropTop,
        className: `MainSectionTitleRow-root ${className ?? ""}`,
        leftSide: showSectionMenus && (
          <MainSectionMenus
            {...{
              ...feInfo,
              pluralName,
              xBtn,
              dropTop,
              saveStatus,
              className: "MainSectionTitleRow-btnsRow-LeftSide",
            }}
          />
        ),
        rightSide: xBtn && (
          <RemoveSectionXBtn className="MainSectionTitleRow-xBtn" {...feInfo} />
        ),
      }}
    />
  );
}

const Styled = styled(SectionTitleRow)<{ $dropTop: boolean }>`
  .MainSectionTitleRow-btnsRow-LeftSide {
    display: flex;
    background-color: ${theme.tertiary};
    border-radius: ${theme.br0};
    .ListMenuBtn-root {
      width: 100px;
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

  .MainSectionMenus-root {
    padding: ${theme.s15};
    border: ${theme.transparentGrayBorder};
  }
`;
