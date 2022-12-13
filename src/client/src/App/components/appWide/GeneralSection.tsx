import React from "react";
import styled, { ThemeProvider } from "styled-components";
import theme, { ThemeName } from "../../theme/Theme";

type Props = {
  themeName: ThemeName;
  children?: React.ReactNode;
  className?: string;
  makeMainSectionEntries?: {
    make: (props: { feId: string }) => React.ReactNode;
    ids: string[];
  };
};
export function GeneralSection({
  className,
  themeName,
  children,
  makeMainSectionEntries,
  ...rest
}: Props) {
  return (
    <ThemeProvider theme={{ section: theme[themeName] }}>
      <Styled
        {...{
          className: `GeneralSection-root ${themeName} ${className ?? ""}`,
          $themeName: themeName,
          ...rest,
        }}
      >
        <div className="GeneralSection-viewable">
          {makeMainSectionEntries && (
            <div className="MainSection-entries">
              {makeMainSectionEntries.ids.map((feId) =>
                makeMainSectionEntries.make({ feId })
              )}
            </div>
          )}
          {children}
        </div>
      </Styled>
    </ThemeProvider>
  );
}
const Styled = styled.section<{ $themeName: ThemeName }>`
  background: ${theme.mainBackground};
  padding: ${theme.s3};

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
  }

  .MainSection-entries {
    .MainSection-root:not(:first-child) {
      border-top: 2px solid ${({ $themeName }) => theme[$themeName].dark};
    }
  }
`;
