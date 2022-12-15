import React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import styled from "styled-components";
import { useUserData } from "../../modules/customHooks/useAuthAndUserData";
import useToggle from "../../modules/customHooks/useToggle";
import { useFeUser } from "../../modules/sectionActorHooks/useFeUser";
import { AnalyzerPlan } from "../../sharedWithServer/SectionsMeta/baseSectionsVarbs";
import theme from "../../theme/Theme";
import { AppMenuDropdown } from "./AppMenuDropdown";
import { NavDropDown } from "./NavDropDown";

export function NavAppMenu() {
  const feUser = useFeUser();
  const { logout } = useUserData();
  const analyzerPlan = feUser.get.valueNext("analyzerPlan") as AnalyzerPlan;
  const isFullPlan = analyzerPlan === "fullPlan";
  const { authStatus } = feUser;

  const { value: doCloseMenuToggle, toggle: closeMenu } = useToggle();
  return (
    <Styled
      {...{ $isFullPlan: isFullPlan }}
      btnIcon={<AiOutlineMenu className="NavBar-menuIcon" />}
      dropDirection={"right"}
      doCloseViewToggle={doCloseMenuToggle}
      className="NavAppMenu-root"
    >
      <AppMenuDropdown />
    </Styled>
  );
}

const Styled = styled(NavDropDown)<{ $isFullPlan: boolean }>`
  display: flex;
  flex-direction: column;
  text-wrap: nowrap;
  .NavBar-menuIcon {
    margin-left: ${theme.s3};
    height: 24px;
    width: 24px;
  }
  .NavAppMenu-dropdown {
    position: relative;
    z-index: 0;
  }
`;
