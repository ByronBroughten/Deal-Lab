import React from "react";
import styled from "styled-components";
import { Button } from "@material-ui/core";
import theme from "../../../../../../../../theme/Theme";

export default styled(Button).attrs(({ className, ...rest }) => ({
  className: "insert-below-btn " + className,
  children: "+",
  ...rest,
}))`
  background-color: ${theme.success};
  color: white;
  white-space: nowrap;
`;
