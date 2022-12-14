import { lighten } from "polished";
import styled from "styled-components";
import theme from "../../../theme/Theme";

export const EntitySpanBasic = styled.span`
  padding: 0;
  background-color: ${lighten(0.53, theme.success)};
  white-space: nowrap;
`;
