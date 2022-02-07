import React from "react";
import styled from "styled-components";
import { SectionName } from "../../../sharedWithServer/Analyzer/SectionMetas/SectionName";
import theme, {
  ThemeSectionName,
  themeSectionNameOrDefault,
} from "../../../theme/Theme";
import ToggleViewBtn from "../../general/ToggleViewBtn";

type Props = {
  className?: string;
  title: string;
  sectionName: SectionName;
  viewProps?: { onClick: Function; viewIsOpen: boolean };
};

export default function MainSectionTitle({
  title,
  viewProps,
  sectionName,
  className,
}: Props) {
  return (
    <MainSectionTitleStyled
      {...{
        className: "main-section-title " + className,
        sectionName: themeSectionNameOrDefault(sectionName),
      }}
    >
      <h4>{title}</h4>
      {viewProps && <ToggleViewBtn {...viewProps} />}
    </MainSectionTitleStyled>
  );
}

const toggleViewBtnSize = "17px";
export const MainSectionTitleStyled = styled.div<{
  sectionName: ThemeSectionName;
}>`
  display: flex;
  justify-content: space-between;
  padding-left: ${theme.s4};
  color: ${theme["gray-800"]};
  background: ${({ sectionName }) => theme[sectionName].main};
  height: ${theme.navBar.height};
  align-items: center;
  box-shadow: ${theme.boxShadow1};

  .toggle-view-btn {
    margin-right: ${theme.s3};
    .icon {
      height: ${toggleViewBtnSize};
      width: ${toggleViewBtnSize};
    }
  }

  h4 {
    line-height: 1rem;
    margin: 0;
  }
`;
