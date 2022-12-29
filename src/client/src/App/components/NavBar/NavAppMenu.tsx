import React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import styled from "styled-components";
import useToggle from "../../modules/customHooks/useToggle";
import { useFeUser } from "../../modules/sectionActorHooks/useFeUser";
import { AnalyzerPlan } from "../../sharedWithServer/SectionsMeta/baseSectionsVarbs";
import theme from "../../theme/Theme";
import { Sidebar } from "../general/SideBar";
import { AppMenuDropdown, AppMenuProps } from "./AppMenuDropdown";
import { NavDropDown } from "./NavDropDown";

export function NavAppMenu({ activeBtnName }: AppMenuProps) {
  const feUser = useFeUser();
  const analyzerPlan = feUser.get.valueNext("analyzerPlan") as AnalyzerPlan;
  const isFullPlan = analyzerPlan === "fullPlan";

  const { value: doCloseMenuToggle } = useToggle();
  return (
    <Styled
      {...{ $isFullPlan: isFullPlan }}
      btnIcon={<AiOutlineMenu className="NavBar-menuIcon" />}
      dropDirection={"right"}
      doCloseViewToggle={doCloseMenuToggle}
      className="NavAppMenu-root"
    >
      <Sidebar className="NavAppMenu-Sidebar">
        <AppMenuDropdown {...{ activeBtnName }} />
      </Sidebar>
    </Styled>
  );
}

const Styled = styled(NavDropDown)<{ $isFullPlan: boolean }>`
  display: flex;
  flex-direction: column;
  text-wrap: nowrap;

  @media (min-width: ${theme.mediaPhone}) {
    visibility: hidden;
  }

  .NavAppMenu-Sidebar {
    box-shadow: ${theme.boxShadow1};
  }

  .NavAppMenu-Sidebar {
    margin-top: calc(${theme.navBar.height} + 1px);
  }

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
