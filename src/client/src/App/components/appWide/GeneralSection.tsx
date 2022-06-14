import React from "react";
import styled, { ThemeProvider } from "styled-components";
import theme, { ThemeName } from "../../theme/Theme";

type Props = {
  themeName: ThemeName;
  children?: React.ReactNode;
  className?: string;
};
export default function MainSection({
  className,
  themeName,
  children,
  ...rest
}: Props) {
  return (
    <ThemeProvider theme={{ section: theme[themeName] }}>
      <Styled
        {...{
          className: `MainSection-root ${themeName} ${className ?? ""}`,
          themeName,
          ...rest,
        }}
      >
        <div className="MainSection-viewable">{children}</div>
      </Styled>
    </ThemeProvider>
  );
}
const Styled = styled.section<{ themeName: ThemeName }>`
  display: flex;
  flex: 0;

  background: red;

  .MainSection-viewable {
    display: flex;
    flex: 1;
    flex-direction: column;
    background-color: ${({ themeName }) => theme[themeName].light};
  }

  .MainSection-entries {
    .MainSection-entry:not(:first-child) {
      border-top: 2px solid ${({ themeName }) => theme[themeName].dark};
    }
  }
`;
