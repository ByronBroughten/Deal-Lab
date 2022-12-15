import { AppBar, Toolbar } from "@material-ui/core";
import { rem } from "polished";
import React from "react";
import { BsHouse } from "react-icons/bs";
import styled from "styled-components";
import theme from "../theme/Theme";
import { DomLink } from "./ActiveDeal/general/DomLink";
import { NavAppMenu } from "./NavBar/NavAppMenu";
import { NavBarBtns } from "./NavBar/NavBarBtns";
import { NavBtn } from "./NavBar/NavBtn";

export function NavBar() {
  return (
    <Styled className="NavBar-root">
      <Toolbar disableGutters={true}>
        <div className="NavBar-leftSide">
          <NavAppMenu />
          <DomLink className="NavBar-navBtnLink" to="/">
            <NavBtn
              className="NavBar-brandBtn"
              icon={<BsHouse className="NavBar-brandIcon" />}
              text={<span className="NavBar-brandName">Deal Lab</span>}
            />
          </DomLink>
        </div>
        <NavBarBtns />
      </Toolbar>
    </Styled>
  );
}

const Styled = styled(AppBar)`
  height: 50px;
  background-color: ${theme.light};
  color: ${theme.primaryNext};
  box-shadow: none;

  .NavBar-leftSide {
    display: flex;
  }

  .MuiToolbar-root {
    position: static;
  }
  div.MuiToolbar-root.MuiToolbar-regular {
    height: ${theme.navBar.height};
    min-height: ${theme.navBar.height};
    display: flex;
    justify-content: space-between;
    align-items: stretch;
  }

  .NavBar-brandBtn {
    font-size: ${theme.siteTitleSize};
    font-weight: 700;
    :hover {
      .NavBar-brandIcon {
        color: ${theme.light};
      }
    }
  }
  .NavBar-navBtnLink {
    color: inherit;
  }

  .NavBar-brandIcon {
    font-size: 27px;
    font-weight: 700;
  }
  .NavBar-brandName {
    margin-left: 4px;
    font-size: ${"22px"};
    font-weight: 500;
    .NavBar-brandNameBold {
    }
    .NavBar-brandNameRegular {
      margin-left: ${theme.s25};
    }
  }

  .NavBar-demoBtnIcon {
    font-size: ${rem("24px")};
  }

  .NavBar-signInUpBtn {
  }

  .NavBar-GetProDropdown {
    .NavDropDown-navBtn {
      background: ${theme.property.main};
    }
  }
  .NavBar-GetProDropdownIcon {
    margin-left: ${rem("4px")};
    font-size: ${rem("23px")};
  }

  .NavBar-GetProDropdownText {
    margin-left: ${theme.s2};
  }
`;
