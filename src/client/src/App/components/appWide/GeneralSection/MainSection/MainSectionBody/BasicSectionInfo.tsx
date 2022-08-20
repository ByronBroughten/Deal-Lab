import React from "react";
import styled, { css } from "styled-components";
import ccs from "../../../../../theme/cssChunks";
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
  ${({ $themeName }) => css`
    ${ccs.subSection.viewable};
    ${ccs.neutralColorSection};
    padding: ${theme.s3};

    .BasicSectionInfo-subSection-viewable {
      ${ccs.mainColorSection($themeName)};
      border-radius: none;
      box-shadow: ${theme.boxShadow1};
      padding: 0.3em;
    }

    .editor-background {
      background-color: ${theme[$themeName].light};
    }
  `}

  .BasicSectionInfo-viewable {
    display: flex;
    flex-direction: row;
  }

  .BasicSectionInfo-subSection-viewable.titledBlock {
    padding-top: ${theme.s1};
  }

  .BasicSectionInfo-subSections {
    .BasicSectionInfo-subSection {
      :first-child {
        .BasicSectionInfo-subSection-viewable {
          border-top-left-radius: ${theme.br1};
          border-top-right-radius: ${theme.br1};
        }
      }
      :not(:first-child) {
        .BasicSectionInfo-subSection-viewable {
          border-top: 1px solid ${theme.transparentGrayBorder};
        }
      }
      :last-child {
        .BasicSectionInfo-subSection-viewable {
          border-bottom-left-radius: ${theme.br1};
          border-bottom-right-radius: ${theme.br1};
        }
      }
    }
  }

  .NumObjEditor-inner {
    :not(:first-child) {
      margin-top: ${theme.s1};
    }
  }
  .editor-background {
    border: 1px solid ${theme.transparentGrayBorder};
  }
`;
