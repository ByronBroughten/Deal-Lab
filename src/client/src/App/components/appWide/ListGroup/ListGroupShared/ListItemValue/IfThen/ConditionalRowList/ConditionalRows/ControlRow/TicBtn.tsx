import { Button } from "@material-ui/core";
import styled from "styled-components";
import theme from "../../../../../../../../../theme/Theme";

export default styled(Button).attrs(({ className, ...rest }) => ({
  color: "outline-secondary",
  className: "tic-btn " + className,
  ...rest,
}))`
  width: 17px;
  padding: 0;

  background-color: ${theme["gray-200"]};
  border: 1px solid ${theme["gray-600"]};
  color: ${theme["gray-700"]};

  border-radius: 0.1rem;
  box-shadow: ${theme.boxShadow1};
`;
