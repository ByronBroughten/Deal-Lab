import styled from "styled-components";
import theme from "../../theme/Theme";
import { TogglerBooleanVarb } from "./TogglerBooleanVarb";

export const TogglerBooleanTitleVarb = styled(TogglerBooleanVarb)`
  .MuiFormControlLabel-root {
    margin: 0;
    .MuiTypography-body1 {
      margin: 0;
      padding: 0;
      line-height: 1.2;
      font-weight: 500;
      color: ${theme.primaryNext};
      font-size: 17px;
    }
  }
`;
