import { Button } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import theme from "../../theme/Theme";
import { StandardBtnProps } from "../general/StandardProps";

export type HollowBtnProps = StandardBtnProps & {
  left?: React.ReactNode;
  right?: React.ReactNode;
  middle?: React.ReactNode;
};
export function HollowBtn({
  left,
  right,
  middle,
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
      {left && <span className="HollowBtn-left">{left}</span>}
      {middle && <span className="HollowBtn-middle">{middle}</span>}
      {right && <span className="HollowBtn-right">{right}</span>}
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
