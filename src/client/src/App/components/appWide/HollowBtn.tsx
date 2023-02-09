import React from "react";
import styled from "styled-components";
import theme from "../../theme/Theme";
import { PlainIconBtn } from "../general/PlainIconBtn";
import { StandardBtnProps } from "../general/StandardProps";

export type HollowBtnProps = StandardBtnProps & {
  left?: React.ReactNode;
  right?: React.ReactNode;
  middle?: React.ReactNode;
};
export function HollowBtn({ className, ...props }: HollowBtnProps) {
  return (
    <Styled
      {...{
        className: `HollowBtn-root ${className ?? ""}`,
        ...props,
      }}
    />
  );
}

const Styled = styled(PlainIconBtn)`
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
