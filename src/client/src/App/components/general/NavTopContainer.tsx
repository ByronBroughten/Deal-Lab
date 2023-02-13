import styled from "styled-components";
import { NavBar } from "../NavBar";
import { SidebarContainerProps } from "./SidebarContainer";

export type NavContainerProps = SidebarContainerProps;
export function NavTopContainer({
  className,
  activeBtnName,
  children,
}: NavContainerProps) {
  return (
    <Styled className={`NavTopAndSideContainer-root ${className ?? ""}`}>
      <NavBar {...{ activeBtnName }} />
      {children}
    </Styled>
  );
}

const Styled = styled.div``;
