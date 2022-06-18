import { Button } from "@material-ui/core";
import styled from "styled-components";
import theme from "../../../../../../../../App/theme/Theme";

export default styled(Button).attrs(({ className, ...rest }) => ({
  className: "insert-below-btn " + className,
  children: "+",
  ...rest,
}))`
  background-color: ${theme.success};
  color: white;
  white-space: nowrap;
`;
