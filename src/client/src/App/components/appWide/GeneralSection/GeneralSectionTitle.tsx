import React from "react";
import styled from "styled-components";
import theme, { ThemeName } from "../../../theme/Theme";
import { StandardProps } from "../../general/StandardProps";

type Props = StandardProps & {
  title: string;
  themeName?: ThemeName;
};

export default function GeneralSectionTitle({
  title,
  themeName,
  className,
  children,
}: Props) {
  return (
    <Styled
      {...{
        className: "GeneralSectionTitle-root " + className,
        themeName: themeName ?? "default",
      }}
    >
      <h4 className="GeneralSectionTitle-titleText">{title}</h4>
      <div className="GeneralSectionTitle-children">{children}</div>
      <h4 className="GeneralSectionTitle-titleText GeneralSectionTitle-invisible"></h4>
    </Styled>
  );
}

const toggleViewBtnSize = "17px";
const Styled = styled.div<{
  themeName: ThemeName;
}>`
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  color: ${theme.softDark};
  background-color: ${({ themeName }) => theme[themeName].main};
  height: 32px;
  align-items: center;
  box-shadow: ${theme.boxShadow1};

  .GeneralSectionTitle-children {
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  .MainSectionTitleAddEntry-invisible {
    visibility: hidden;
  }

  .GeneralSectionTitle-titleText {
    padding: 0 ${theme.s4};
    line-height: 1rem;
    margin: 0;
    font-size: ${theme.f3};
    white-space: nowrap;
  }
`;
