import styled from "styled-components";
import theme from "../../theme/Theme";
import { AppMenuDropdown, AppMenuProps } from "../NavBar/AppMenuDropdown";
import { Sidebar } from "./SideBar";
import { StandardProps } from "./StandardProps";

export interface SidebarContainerProps extends StandardProps, AppMenuProps {}
export function SidebarContainer({
  children,
  className,
  activeBtnName,
}: SidebarContainerProps) {
  return (
    <StyledAppContainer className={`SidebarContainer-root ${className ?? ""}`}>
      <Sidebar className="SidebarContainer-sideBar">
        <AppMenuDropdown {...{ activeBtnName }} />
      </Sidebar>
      <div className="SidebarContainer-content">{children}</div>
    </StyledAppContainer>
  );
}
const StyledAppContainer = styled.div`
  display: flex;
  margin-left: 170px;
  @media (max-width: ${theme.mediaPhone}) {
    margin-left: 0;
    .SidebarContainer-sideBar {
      display: none;
    }
  }

  .SidebarContainer-content {
    width: 100%;
    height: 100%;
  }
`;
