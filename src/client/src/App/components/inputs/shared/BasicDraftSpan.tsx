import { lighten } from "polished";
import styled from "styled-components";

export default styled.span`
  padding: 0;
  background-color: ${({ theme }) => lighten(0.25, theme.success)};
  white-space: nowrap;
`;
