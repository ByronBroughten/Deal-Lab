import React from "react";
import styled from "styled-components";
import { NavBar } from "../NavBar";
import { SidebarContainer, SidebarContainerProps } from "./SidebarContainer";

export function NavContainer({
  className,
  activeBtnName,
  ...rest
}: SidebarContainerProps) {
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
