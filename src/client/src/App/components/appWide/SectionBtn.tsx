import styled from "styled-components";
import { Button } from "@material-ui/core";
import theme from "../../theme/Theme";
import ccs from "../../theme/cssChunks";

export default styled(Button).attrs(({ className, ...rest }) => ({
  variant: "contained",
  disableRipple: true,
  className: "section-btn " + className,
  ...rest,
}))`
  height: calc(1.5em + 0.5rem + 2px);
  white-space: nowrap;
  ${ccs.coloring.section.lightNeutral}
  color: ${theme.dark};
  :hover {
    background-color: ${theme["gray-600"]};
    color: ${theme["gray-300"]};
  }
`;
