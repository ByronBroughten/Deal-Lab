import React from "react";
import styled from "styled-components";
import { SectionName } from "../../../sharedWithServer/SectionMetas/SectionName";
import theme, {
  ThemeSectionName,
  themeSectionNameOrDefault,
} from "../../../theme/Theme";
import { StandardProps } from "../../general/StandardProps";

type Props = StandardProps & {
  title: string;
  sectionName: SectionName;
};

export default function GeneralSectionTitle({
  title,
  sectionName,
  className,
  children,
}: Props) {
  return (
    <MainSectionTitleStyled
      {...{
        className: "GeneralSectionTitle-root main-section-title " + className,
        sectionName: themeSectionNameOrDefault(sectionName),
      }}
    >
      <h4 className="GeneralSectionTitle-titleText">{title}</h4>
      {children}
      <h4 className="GeneralSectionTitle-titleText GeneralSectionTitle-invisible"></h4>
    </MainSectionTitleStyled>
  );
}

const toggleViewBtnSize = "17px";
export const MainSectionTitleStyled = styled.div<{
  sectionName: ThemeSectionName;
}>`
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  color: ${theme["gray-800"]};
  background-color: ${({ sectionName }) => theme[sectionName].main};
  height: 32px;
  align-items: center;
  box-shadow: ${theme.boxShadow1};

  .MainSectionTitleAddEntry-invisible {
    visibility: hidden;
  }

  .GeneralSectionTitle-titleText {
    padding: 0 ${theme.s4};
    line-height: 1rem;
    margin: 0;
    font-size: 1.2rem;
  }
`;
