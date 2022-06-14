import { Button } from "@material-ui/core";
import React from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import styled from "styled-components";
import ccs from "../../theme/cssChunks";
import theme from "../../theme/Theme";

export default styled(Button).attrs(({ className = "", ...rest }) => ({
  className: "NextBtn-root" + className,
  variant: "contained",
  children: <AiOutlineArrowRight size={22} className="icon" />,
  ...rest,
}))`
  ${ccs.xPlusBtnBody}
  background-color: ${theme.next.main};
  color: ${theme.dark};
  :hover {
    color: ${theme.light};
    background-color: ${theme.next.dark};
  }
`;
