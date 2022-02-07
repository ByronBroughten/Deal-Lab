import React from "react";
import styled, { css } from "styled-components";
import theme from "../../theme/Theme";
import { Button } from "@material-ui/core";
import { StandardBtnProps } from "../general/StandardProps";
import { CgMathPlus } from "react-icons/cg";
import ccs from "../../theme/cssChunks";
import { rem } from "polished";

type Props = StandardBtnProps & { smallSquare?: boolean; isOpen?: boolean };
export default function PlusBtn({
  children,
  className,
  smallSquare = false,
  isOpen = false,
  ...rest
}: Props) {
  const childrenIsDefeault = !children;
  return (
    <Styled
      {...{
        className: "PlusBtn " + className ?? "",
        variant: "contained",
        size: "small",
        children: children || <CgMathPlus size={20} className="icon" />,
        smallSquare: smallSquare || childrenIsDefeault,
        isOpen,
        ...rest,
      }}
    />
  );
}

const activeCss = css`
  color: ${theme.light};
  font-weight: bold;
  background-color: ${theme.plus.dark};
`;
const Styled = styled(Button)<{ smallSquare: boolean; isOpen: boolean }>`
  padding: 1px ${theme.s2} 0 ${theme.s2};
  color: ${theme["gray-800"]};
  background-color: ${theme.plus.main};
  border: 1px solid ${theme.plus.main};
  :hover {
    ${activeCss}
  }
  ${({ isOpen }) => isOpen && activeCss};

  white-space: nowrap;
  .MuiTouchRipple-root {
    visibility: hidden;
  }

  ${({ smallSquare }) => {
    if (smallSquare)
      return css`
        ${ccs.xPlusBtnBody}
      `;
    else
      return css`
        width: ${rem("70px")};
      `;
  }}
`;
