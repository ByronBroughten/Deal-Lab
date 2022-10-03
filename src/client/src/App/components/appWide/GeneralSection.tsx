import React from "react";
import styled, { css, ThemeProvider } from "styled-components";
import theme, { ThemeName } from "../../theme/Theme";

type Props = {
  themeName: ThemeName;
  children?: React.ReactNode;
  className?: string;
};
export function GeneralSection({
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
          $themeName: themeName,
          ...rest,
        }}
      >
        <div className="MainSection-viewable">{children}</div>
      </Styled>
    </ThemeProvider>
  );
}
const Styled = styled.section<{ $themeName: ThemeName }>`
  display: flex;
  flex: 0;

  .GeneralSectionInfo-root {
    padding: ${theme.s25};
  }

  .GeneralSection-addEntryBtnDiv {
    margin-top: ${theme.s3};
    display: flex;
    justify-content: center;
    padding-bottom: ${theme.s4};
  }

  .MainSection-addChildBtn {
    width: 75%;
    max-width: 600px;
    height: 40px;
    ${({ $themeName }) => css`
      background: ${theme[$themeName].main};
      :hover,
      :active {
        background-color: ${theme[$themeName].dark};
      }
    `}
  }

  .MainSection-viewable {
    display: flex;
    flex: 1;
    flex-direction: column;
    background-color: ${({ $themeName }) => theme[$themeName].light};
  }

  .MainSection-entries {
    .MainSection-entry:not(:first-child) {
      border-top: 2px solid ${({ $themeName }) => theme[$themeName].dark};
    }
  }
`;
