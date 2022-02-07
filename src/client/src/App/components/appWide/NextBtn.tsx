import React from "react";
import styled from "styled-components";
import { Button } from "@material-ui/core";
import theme from "../../theme/Theme";
import ccs from "../../theme/cssChunks";
import { AiOutlineArrowRight } from "react-icons/ai";

export default styled(Button).attrs(({ className = "", ...rest }) => ({
  className: "NextBtn-root" + className,
  variant: "contained",
  children: <AiOutlineArrowRight size={22} className="icon" />,
  ...rest,
}))`
  ${ccs.xPlusBtnBody}
  background-color: ${theme.loan.border};
  color: ${theme.dark};
  :hover {
    color: ${theme.light};
    background-color: ${theme.loan.dark};
  }
`;
