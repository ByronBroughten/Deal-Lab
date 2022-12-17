import styled from "styled-components";
import { AppMenuDropdown, AppMenuProps } from "../NavBar/AppMenuDropdown";
import { StandardProps } from "./StandardProps";

interface Props extends StandardProps, AppMenuProps {}
export function SidebarContainer({
  children,
  className,
  activeBtnName,
}: Props) {
  return (
    <StyledAppContainer className={`SidebarContainer-root ${className ?? ""}`}>
      <div className="SidebarContainer-sideBar">
        <AppMenuDropdown {...{ activeBtnName }} />
      </div>
      <div className="SidebarContainer-content">{children}</div>
    </StyledAppContainer>
  );
}
const StyledAppContainer = styled.div`
  display: flex;
  margin-left: 150px;
  .SidebarContainer-content {
    width: 100%;
    height: 100%;
  }
  .SidebarContainer-sideBar {
    margin-top: 100px;
    height: 100%; /* Full-height: remove this if you want "auto" height */
    width: 150px; /* Set the width of the sidebar */
    position: fixed; /* Fixed Sidebar (stay in place on scroll) */
    z-index: 1; /* Stay on top */
    top: 0; /* Stay at the top */
    left: 0;
    overflow-x: hidden; /* Disable horizontal scroll */
    padding-top: 20px;
  }
`;
