import React from "react";
import styled from "styled-components";
import { NavBar } from "../NavBar";
import { SidebarContainer, SidebarContainerProps } from "./SidebarContainer";

export type NavContainerProps = SidebarContainerProps;
export function NavContainer({
  className,
  activeBtnName,
  ...rest
}: NavContainerProps) {
  return (
    <Styled className={`NavContainer-root ${className ?? ""}`}>
      <NavBar {...{ activeBtnName }} />
      <SidebarContainer
        {...{
          ...rest,
          activeBtnName,
        }}
      />
    </Styled>
  );
}

const Styled = styled.div``;
