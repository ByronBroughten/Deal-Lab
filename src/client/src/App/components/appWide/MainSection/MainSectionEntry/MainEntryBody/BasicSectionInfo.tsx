import React from "react";
import styled, { css } from "styled-components";
import ccs from "../../../../../theme/cssChunks";
import theme, { ThemeSectionName } from "../../../../../theme/Theme";

type Props = {
  className?: string;
  sectionName: ThemeSectionName;
};
export default function SavableSectionInfo({
  className,
  sectionName,
  ...rest
}: Props) {
  return (
    <Styled
      {...{
        className: `SavableSectionInfo-root ${className}`,
        sectionName,
        ...rest,
      }}
    />
  );
}
const Styled = styled.div<{ sectionName: ThemeSectionName }>`
  ${({ sectionName }) => css`
    ${ccs.subSection.main(sectionName)};
    .BasicSectionInfo-subSection-viewable,
    .editor-background {
      background-color: ${theme[sectionName].light};
    }
  `}

  .StandardLabel-root {
    font-size: 0.95em;
  }

  .BasicSectionInfo-subSection {
    margin-top: ${theme.s1};
    .BasicSectionInfo-subSection-viewable {
      box-shadow: ${theme.boxShadow1};
      padding: 0.3em;
    }
  }

  .BasicSectionInfo-subSections {
    .BasicSectionInfo-subSection {
      :first-child {
        .BasicSectionInfo-subSection-viewable {
          border-top-left-radius: ${theme.br1};
          border-top-right-radius: ${theme.br1};
        }
      }
    }
    .BasicSectionInfo-subSection {
      :last-child {
        .BasicSectionInfo-subSection-viewable {
          border-bottom-left-radius: ${theme.br1};
          border-bottom-right-radius: ${theme.br1};
        }
      }
    }
  }

  .numeric-editor {
    :not(:first-child) {
      margin-top: ${theme.s1};
    }
  }
  .MuiFormControl-root.labeled {
    min-width: 127px;
  }
  .editor-background {
    border: 1px solid ${theme["gray-500"]};
  }
`;
