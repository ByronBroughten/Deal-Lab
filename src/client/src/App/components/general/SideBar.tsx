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
  width: 150px; /* Set the width of the sidebar */
  position: fixed; /* Fixed Sidebar (stay in place on scroll) */
  z-index: 5; /* Stay on top */
  top: 0; /* Stay at the top */
  left: 0;
  overflow-x: hidden; /* Disable horizontal scroll */
  margin-top: ${theme.navBar.height};
  padding-top: 70px;
  background: ${theme.light};
`;
