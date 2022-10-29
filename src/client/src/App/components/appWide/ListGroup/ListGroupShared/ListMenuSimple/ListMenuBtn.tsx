import { Button } from "@material-ui/core";
import { rem } from "polished";
import React from "react";
import styled from "styled-components";
import theme, { ThemeName } from "../../../../../theme/Theme";
import { StandardBtnProps } from "../../../../general/StandardProps";

interface Props extends StandardBtnProps {
  themeName?: ThemeName;
  icon?: React.ReactNode;
  text?: React.ReactNode;
}
export function ListMenuBtn({
  className,
  themeName,
  icon,
  text,
  ...props
}: Props) {
  return (
    <Styled
      {...{
        $themeName: themeName,
        className: "ListMenuBtn-root " + className,
        ...props,
      }}
    >
      {icon && <span className="ListMenuBtn-icon">{icon}</span>}
      {text && <span className="ListMenuBtn-text">{text}</span>}
    </Styled>
  );
}

const Styled = styled(Button)<{ $themeName?: ThemeName }>`
  font-size: 0.8rem;
  padding: ${rem("2px")} ${rem("4px")};
  box-shadow: ${theme.boxShadow1};
  border-radius: ${theme.br1};
  line-height: 1rem;
  background-color: ${theme["gray-300"]};
  border: 1px solid ${theme.transparentGrayBorder};
  color: ${theme.dark};
  :hover {
    background-color: ${theme["gray-600"]};
    color: ${theme.light};
  }
  .ListMenuBtn-text {
    margin-left: ${theme.s2};
  }
  .ListMenuBtn-icon {
    font-size: 17px;
    display: flex;
    align-items: center;
  }
`;
