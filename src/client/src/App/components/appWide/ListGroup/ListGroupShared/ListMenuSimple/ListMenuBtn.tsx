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
  font-size: ${theme.labelSize};
  padding: ${rem("2px")} ${rem("4px")};
  box-shadow: none;
  border-radius: ${theme.br0};
  line-height: 1rem;
  background-color: ${theme.light};
  border: 1px solid ${theme.deal.main};
  border-radius: ${theme.br0};
  color: ${theme.deal.main};
  :hover {
    background-color: ${theme.deal.main};
    color: ${theme.deal.contrastText};
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
