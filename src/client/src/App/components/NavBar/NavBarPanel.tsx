import styled from "styled-components";
import theme from "../../theme/Theme";

export const NavBarPanel = styled.div`
  width: 600px;
  min-width: 300px;
  background: ${theme.light};
  padding: ${theme.s4};
  border-radius: 0 0, ${theme.br0} ${theme.br0};
`;
