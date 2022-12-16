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
export function NavDropdownMenuBtn({
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
        className: "NavDropdownMenuBtn-root " + className,
        ...props,
      }}
    >
      {icon && <span className="NavDropdownMenuBtn-icon">{icon}</span>}
      {text && <span className="NavDropdownMenuBtn-text">{text}</span>}
    </Styled>
  );
}

const Styled = styled(Button)<{ $themeName?: ThemeName }>`
  font-size: ${theme.titleSize};
  border-radius: ${theme.br0};
  line-height: 1rem;
  box-shadow: ${theme.boxShadow1};
  background-color: ${theme["gray-200"]};
  border: 1px solid ${theme["gray-500"]};
  color: ${theme.dark};
  height: ${rem("30px")};

  width: 100%;
  border-radius: 0;

  display: flex;
  justify-content: flex-start;
  padding: ${theme.s4};
  .MuiTouchRipple-root {
    visibility: hidden;
  }

  .MuiButton-label {
    white-space: nowrap;
  }

  :hover,
  :focus {
    background-color: ${theme.primaryNext};
    color: ${theme.deal.contrastText};
  }
  .NavDropdownMenuBtn-text {
    margin-left: ${theme.s2};
  }
  .NavDropdownMenuBtn-icon {
    font-size: 17px;
    display: flex;
    align-items: center;
  }
`;
