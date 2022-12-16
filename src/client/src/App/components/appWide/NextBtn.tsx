import { Button } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import React from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import styled from "styled-components";
import ccs from "../../theme/cssChunks";
import theme from "../../theme/Theme";

export function NextBtn({ className, ...rest }: ButtonProps) {
  return (
    <Styled
      {...{
        ...rest,
        className: `NextBtn-root ${className ?? ""}`,
        variant: "contained",
      }}
    >
      {<AiOutlineArrowRight size={22} className="icon" />}
    </Styled>
  );
}

const Styled = styled(Button)`
  ${ccs.xPlusBtnBody};
  background-color: ${theme.mgmt.dark};
  color: ${theme.light};
  :hover {
    background-color: ${theme.mgmt.main};
  }
`;
