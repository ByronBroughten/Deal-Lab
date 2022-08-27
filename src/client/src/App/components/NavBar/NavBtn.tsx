import { ButtonProps } from "@material-ui/core/Button";
import { rem } from "polished";
import React from "react";
import styled, { css } from "styled-components";
import theme from "../../theme/Theme";
import PlainBtn from "../general/PlainBtn";

export type NavBtnProps = ButtonProps & {
  $isactive?: boolean;
  target?: string;
  icon?: React.ReactNode;
  text: string | React.ReactNode;
};
export default function NavBtn({
  className,
  icon,
  text,
  ...rest
}: NavBtnProps) {
  return (
    <Styled
      {...{
        className: `NavBtn ${className}`,
        disableRipple: true,
        ...rest,
        // title: "Test title",
      }}
    >
      {icon && <span className="NavBtn-icon">{icon}</span>}
      {<span className="NavBtn-text">{text}</span>}
    </Styled>
  );
}
const Styled = styled(PlainBtn)<{ $isactive?: boolean }>`
  font-size: ${rem("14px")};
  padding: 0 ${theme.s4};
  height: 100%;
  .NavBtn-text {
    margin-left: ${rem("2px")};
    display: flex;
    align-items: center;
  }
  .NavBtn-icon {
    display: flex;
    align-items: center;
    font-size: 20px;
  }

  flex: 1;
  white-space: nowrap;
  background-color: ${theme.deal.main};
  font-weight: 700;

  :hover {
    box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.5);
    color: ${theme.light};
    background-color: ${theme.deal.main};
  }

  ${({ $isactive }) =>
    $isactive &&
    css`
      box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.5);
      color: ${theme.light};
      background-color: ${theme.deal.main};
    `};
`;
