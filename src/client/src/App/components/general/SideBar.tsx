import styled from "styled-components";
import theme from "../../theme/Theme";
import { StandardProps } from "./StandardProps";

export function Sidebar({ children, className }: StandardProps) {
  return (
    <Styled className={`Sidebar-root ${className ?? ""}`}>{children}</Styled>
  );
}

const Styled = styled.div`
  height: 100%; /* Full-height: remove this if you want "auto" height */
  min-width: 170px;
  position: fixed; /* Fixed Sidebar (stay in place on scroll) */
  z-index: 5; /* Stay on top */
  top: 0; /* Stay at the top */
  left: 0;
  overflow-x: hidden; /* Disable horizontal scroll */
  margin-top: ${theme.navBar.height};
  padding-top: 125px;
  background: ${theme.light};
`;
