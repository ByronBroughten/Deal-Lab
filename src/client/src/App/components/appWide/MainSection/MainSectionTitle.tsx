import React from "react";
import styled from "styled-components";
import { SectionName } from "../../../sharedWithServer/Analyzer/SectionMetas/SectionName";
import theme, {
  ThemeSectionName,
  themeSectionNameOrDefault,
} from "../../../theme/Theme";
import { StandardProps } from "../../general/StandardProps";

type Props = StandardProps & {
  title: string;
  sectionName: SectionName;
};

export default function MainSectionTitle({
  title,
  sectionName,
  className,
  children,
}: Props) {
  return (
    <MainSectionTitleStyled
      {...{
        className: "MainSectionTitle-root main-section-title " + className,
        sectionName: themeSectionNameOrDefault(sectionName),
      }}
    >
      <h4 className="MainSectionTitle-titleText">{title}</h4>
      {children}
      <h4 className="MainSectionTitle-titleText MainSectionTitle-invisible"></h4>
    </MainSectionTitleStyled>
  );
}

const toggleViewBtnSize = "17px";
export const MainSectionTitleStyled = styled.div<{
  sectionName: ThemeSectionName;
}>`
  display: flex;
  justify-content: space-between;
  padding: 0 ${theme.s4};
  color: ${theme["gray-800"]};
  background-color: ${({ sectionName }) => theme[sectionName].main};
  height: 32px;
  // ${theme.navBar.height};
  align-items: center;
  box-shadow: ${theme.boxShadow1};

  .MainSectionTitleAddEntry-invisible {
    visibility: hidden;
  }

  .toggle-view-btn {
    margin-right: ${theme.s3};
    .icon {
      height: ${toggleViewBtnSize};
      width: ${toggleViewBtnSize};
    }
  }

  .MainSectionTitle-titleText {
    line-height: 1rem;
    margin: 0;
    font-size: 1.2rem;
  }
`;
