import styled, { ThemeProvider } from "styled-components";
import theme, { ThemeSectionName } from "../../theme/Theme";
import React from "react";

type Props = {
  sectionName: ThemeSectionName;
  children?: React.ReactNode;
  className?: string;
};
export default function MainSection({
  className,
  sectionName,
  children,
  ...rest
}: Props) {
  return (
    <ThemeProvider theme={{ section: theme[sectionName] }}>
      <Styled
        {...{
          className: `MainSection-root ${sectionName} ${className ?? ""}`,
          sectionName,
          ...rest,
        }}
      >
        <div className="MainSection-viewable">{children}</div>
      </Styled>
    </ThemeProvider>
  );
}
const Styled = styled.section<{ sectionName: ThemeSectionName }>`
  display: flex;
  flex: 0;

  .MainSection-viewable {
    display: flex;
    flex: 1;
    flex-direction: column;
    background-color: ${({ sectionName }) => theme[sectionName].light};
    box-shadow: ${theme.boxShadow1};
  }

  .MainSection-entries {
    .MainSection-entry:not(:first-child) {
      margin-top: ${theme.s1};
      border-top: 2px solid ${({ sectionName }) => theme[sectionName].dark};
    }
  }
`;
