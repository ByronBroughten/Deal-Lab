import styled from "styled-components";
import theme from "../../theme/Theme";
import { PlainIconBtn } from "../general/PlainIconBtn";

export const StyledIconBtn = styled(PlainIconBtn)`
  border-radius: ${theme.br0};
  padding: 0 ${theme.s2};
  color: ${theme.primaryNext};
  :hover {
    background: ${theme.secondary};
    color: ${theme.light};
  }
`;
