import React from "react";
import styled, { css } from "styled-components";
import { CgClose } from "react-icons/cg";
import { StandardBtnProps } from "../general/StandardProps";
import { Button } from "@material-ui/core";
import theme from "../../theme/Theme";
import ccs from "../../theme/cssChunks";
import { rem } from "polished";

export default function XBtn({
  children,
  className,
  ...rest
}: StandardBtnProps) {
  const childrenIsDefeault = !children;
  return (
    <Styled
      {...{
        className: "XBtn " + className ?? "",
        variant: "contained",
        size: "small",
        children: children || <CgClose size={20} className="icon" />,
        childrenIsDefeault,
        ...rest,
      }}
    />
  );
}

const Styled = styled(Button)<{ childrenIsDefeault: boolean }>`
  padding: 1px ${theme.s2} 0 ${theme.s2};
  color: ${theme["gray-800"]};
  background-color: ${theme.error.main};
  border: 1px solid ${theme.error.main};
  :hover {
    color: ${theme.light};
    font-weight: bold;
    background-color: ${theme.error.dark};
  }
  white-space: nowrap;
  .MuiTouchRipple-root {
    visibility: hidden;
  }

  ${({ childrenIsDefeault }) => {
    if (childrenIsDefeault)
      return css`
        ${ccs.xPlusBtnBody}
      `;
    else
      return css`
        width: ${rem("70px")};
      `;
  }}
`;
