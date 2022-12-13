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
export function NavBtn({ className, icon, text, ...rest }: NavBtnProps) {
  return (
    <Styled
      {...{
        className: `NavBtn-root ${className}`,
        disableRipple: true,
        ...rest,
        // title: "Test title",
      }}
    >
      {icon && <span className="NavBtn-icon">{icon}</span>}
      {text && <span className="NavBtn-text">{text}</span>}
    </Styled>
  );
}
const Styled = styled(PlainBtn)<{ $isactive?: boolean }>`
  color: inherit;
  font-size: ${rem("16px")};
  padding: 0 ${theme.s3};
  height: 100%;
  flex: 1;
  white-space: nowrap;
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

  :hover {
    background-color: ${theme.primaryNext};
    color: ${theme.light};
  }

  ${({ $isactive }) =>
    $isactive &&
    css`
      background-color: ${theme.primaryNext};
      color: ${theme.light};
      box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.5);
    `};
`;
