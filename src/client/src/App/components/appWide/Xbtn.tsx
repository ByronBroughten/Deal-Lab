import { Button } from "@material-ui/core";
import { rem } from "polished";
import React from "react";
import { CgClose } from "react-icons/cg";
import styled, { css } from "styled-components";
import ccs from "../../theme/cssChunks";
import theme from "../../theme/Theme";
import { StandardBtnProps } from "../general/StandardProps";

export function XBtn({ children, className, ...rest }: StandardBtnProps) {
  console.log(`XBtn ${className}`);
  return (
    <Styled
      {...{
        className: "XBtn " + className ?? "",
        variant: "contained",
        size: "small",
        children: children || <CgClose size={20} className="icon" />,
        $childrenIsDefault: !children,
        ...rest,
      }}
    />
  );
}

const Styled = styled(Button)<{ $childrenIsDefault: boolean }>`
  padding: 1px ${theme.s2} 0 ${theme.s2};
  color: ${theme["gray-800"]};
  background-color: ${theme.error.main};
  border: 1px solid ${theme.transparentGrayDark};
  :hover {
    color: ${theme.light};
    font-weight: bold;
    background-color: ${theme.error.dark};
    border-color: ${theme.error.dark};
  }
  white-space: nowrap;
  .MuiTouchRipple-root {
    visibility: hidden;
  }

  ${({ $childrenIsDefault }) => {
    if ($childrenIsDefault)
      return css`
        ${ccs.xPlusBtnBody}
      `;
    else
      return css`
        width: ${rem("70px")};
      `;
  }}
`;
