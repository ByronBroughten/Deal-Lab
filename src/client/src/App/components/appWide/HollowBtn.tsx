import { Button } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import theme, { ThemeName } from "../../theme/Theme";
import { StandardBtnProps } from "../general/StandardProps";

export type HollowBtnProps = StandardBtnProps & {
  themeName?: ThemeName;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  text?: React.ReactNode;
};
export function HollowBtn({
  text,
  leftIcon,
  rightIcon,
  themeName,
  children,
  className,
  ...props
}: HollowBtnProps) {
  return (
    <Styled
      {...{
        variant: "contained",
        disableRipple: true,
        className: `HollowBtn-root ${className ?? ""}`,
        ...props,
      }}
    >
      {leftIcon && <span className="HollowBtn-rightIcon">{leftIcon}</span>}
      {text && <span className="HollowBtn-leftIcon">{text}</span>}
      {children}
      {rightIcon && <span className="HollowBtn-text">{rightIcon}</span>}
    </Styled>
  );
}

const Styled = styled(Button)`
  height: calc(1.5em + 0.5rem + 2px);
  white-space: nowrap;
  border-radius: ${theme.br0};
  box-shadow: none;
  border: solid 1px ${theme.primaryNext};
  background-color: ${theme.light};
  color: ${theme.primaryNext};
  font-size: ${theme.labelSize};

  :hover {
    background-color: ${theme.secondary};
    color: ${theme.light};
    box-shadow: none;
  }
`;

// const HollowBtn = styled(Button).attrs(({ className, ...rest }) => ({
//   variant: "contained",
//   disableRipple: true,
//   className: "section-btn " + className,
//   ...rest,
// }))`
//   height: calc(1.5em + 0.5rem + 2px);
//   white-space: nowrap;

//   ${ccs.coloring.section.lightNeutral}
//   color: ${theme.dark};
//   :hover {
//     background-color: ${theme["gray-600"]};
//     color: ${theme["gray-300"]};
//   }
//   font-weight: 700;
//   color: ${theme["gray-800"]};
// `;

// export default HollowBtn;
