import React from "react";
import styled from "styled-components";
import theme, { ThemeName } from "../../../../../theme/Theme";

type Props = {
  className?: string;
  sectionName: ThemeName;
};
export default function BasicSectionInfo({
  className,
  sectionName,
  ...rest
}: Props) {
  return (
    <Styled
      {...{
        className: `BasicSectionInfo-root ${className}`,
        $themeName: sectionName,
        ...rest,
      }}
    />
  );
}
const Styled = styled.div<{ $themeName: ThemeName }>`
  .BasicSectionInfo-viewable {
    display: flex;
    flex-direction: row;
  }

  .BasicSectionInfo-subSections {
    .BasicSectionInfo-subSection {
      :not(:first-child) {
        margin-top: ${theme.s3};
      }

      :first-child {
        .BasicSectionInfo-subSection-viewable {
          border-top-left-radius: ${theme.br0};
          border-top-right-radius: ${theme.br0};
        }
      }
      :last-child {
        .BasicSectionInfo-subSection-viewable {
          border-bottom-left-radius: ${theme.br0};
          border-bottom-right-radius: ${theme.br0};
        }
      }
    }
  }
`;
