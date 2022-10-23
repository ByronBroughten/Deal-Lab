import { AppBar, Toolbar } from "@material-ui/core";
import { rem } from "polished";
import React from "react";
import { BsFillHouseDoorFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { constants } from "../Constants";
import theme from "../theme/Theme";
import { NavBarBtns } from "./NavBar/NavBarBtns";
import NavBtn from "./NavBar/NavBtn";
import { NavUserMenu } from "./NavBar/NavUserMenu";

export function NavBar() {
  const appTitle = "Ultimate Property Analyzer" + (constants.isBeta ? "" : ""); // BETA

  return (
    <Styled className="NavBar-root">
      <Toolbar disableGutters={true}>
        <div className="NavBar-leftSide">
          <NavUserMenu />
          <Link className="NavBar-navBtnLink" to="/">
            <NavBtn
              className="NavBar-brandBtn"
              icon={<BsFillHouseDoorFill className="NavBar-brandIcon" />}
              text={<span className="NavBar-brandName">{appTitle}</span>}
            />
          </Link>
        </div>
        <NavBarBtns />
      </Toolbar>
    </Styled>
  );
}

const Styled = styled(AppBar)`
  .MuiToolbar-root {
    position: static;
  }
  padding: 0;
  background-color: ${theme.deal.main};
  color: ${theme.dark};
  height: ${theme.navBar.height};
  div.MuiToolbar-root.MuiToolbar-regular {
    height: ${theme.navBar.height};
    min-height: ${theme.navBar.height};
    display: flex;
    justify-content: space-between;
    align-items: stretch;
  }

  .NavBar-brandBtn {
    font-size: 1.3rem;
    font-weight: 700;
    color: ${theme.dark};
    :hover {
      color: ${theme.light};
    }
  }
  .NavBar-brandIcon {
    font-size: 25px;
  }
  .NavBar-brandName {
    margin-left: 4px;
    font-size: ${constants.isBeta ? "16px" : "20px"};
  }

  .NavBar-navBtnLink {
    display: inherit;
    align-items: inherit;
    height: inherit;
    text-decoration: none;
  }

  .NavBar-demoBtnIcon {
    font-size: ${rem("24px")};
  }

  .NavBar-signInUpBtn {
    background: ${theme.property.main};
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

  .NavBar-leftSide {
    display: flex;
  }
`;
