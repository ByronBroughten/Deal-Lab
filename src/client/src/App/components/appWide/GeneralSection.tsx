import React from "react";
import styled, { ThemeProvider } from "styled-components";
import theme, { ThemeName } from "../../theme/Theme";

type Props = {
  sectionName: ThemeName;
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
const Styled = styled.section<{ sectionName: ThemeName }>`
  display: flex;
  flex: 0;

  background: red;

  .MainSection-viewable {
    display: flex;
    flex: 1;
    flex-direction: column;
    background-color: ${({ sectionName }) => theme[sectionName].light};
  }

  .MainSection-entries {
    .MainSection-entry:not(:first-child) {
      border-top: 2px solid ${({ sectionName }) => theme[sectionName].dark};
    }
  }
`;
