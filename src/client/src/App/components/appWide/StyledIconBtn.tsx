import styled from "styled-components";
import theme from "../../theme/Theme";
import { PlainIconBtn } from "../general/PlainIconBtn";

export const StyledIconBtn = styled(PlainIconBtn)`
  color: ${theme.primaryNext};
  :hover {
    background: ${theme.secondary};
    color: ${theme.light};
  }
`;
