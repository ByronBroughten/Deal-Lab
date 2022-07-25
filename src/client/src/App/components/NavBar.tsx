import { AppBar, Toolbar } from "@material-ui/core";
import { rem } from "polished";
import React from "react";
import { BsArrowUpCircle, BsFillHouseDoorFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useFeUser } from "../modules/sectionActorHooks/useFeUser";
import theme from "../theme/Theme";
import { LoginForm } from "./NavBar/LoginForm";
import NavBtn from "./NavBar/NavBtn";
import NavDropDown from "./NavBar/NavDropDown";
import { NavUserMenu, NavUserMenuProps } from "./NavBar/NavUserMenu";
import { RegisterForm } from "./NavBar/RegisterForm";
import { UpgradeUserToProPanel } from "./NavBar/UpgradeUserToProPanel";

export default function NavBar(props: NavUserMenuProps) {
  const { isPro, isLoggedIn, isGuest } = useFeUser();
  return (
    <Styled className="NavBar-root">
      <Toolbar disableGutters={true}>
        <div className="NavBar-leftSide">
          <Link className="NavBar-analyzerLink" to="/">
            <NavBtn className="NavBar-brandBtn">
              <BsFillHouseDoorFill className="NavBar-brandIcon" />
              <span className="NavBar-brandName">Ultimate Deal Analyzer</span>
            </NavBtn>
          </Link>
          {/* <NavBtn
            className="NavBar-demoBtn NavBtn"
            href="https://www.youtube.com/watch?v=Fw_HMWWRRUk"
            target="_blank"
          >
            <span className="NavBar-demoBtnText">Demo</span>
            <AiOutlineYoutube className="NavBar-demoBtnIcon" />
          </NavBtn> */}
        </div>
        <div className="NavBar-rightSide">
          {isGuest && (
            <>
              <NavDropDown btnText="Create Account">
                <RegisterForm />
              </NavDropDown>
              <NavDropDown btnText="Login">
                <LoginForm />
              </NavDropDown>
            </>
          )}
          {isLoggedIn && !isPro && (
            <NavDropDown
              className="NavBar-getProBtn"
              btnText={
                <>
                  <span className="NavBar-getProBtnText">Pro</span>
                  <BsArrowUpCircle className="NavBar-getProBtnIcon" />
                </>
              }
            >
              <UpgradeUserToProPanel />
            </NavDropDown>
          )}
          <NavUserMenu {...props} />
        </div>
      </Toolbar>
    </Styled>
  );
}

const Styled = styled(AppBar)`
  .DropdownForm-comingSoon {
    display: flex;
    justify-content: center;
  }
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

  .NavBar-brandIcon {
    font-size: 25px;
  }

  .NavBar-brandName {
    margin-left: 8px;
  }

  .NavBar-analyzerLink {
    display: inherit;
    align-items: inherit;
    height: inherit;
    text-decoration: none;
  }
  .NavBar-demoBtn {
    height: 100%;
  }
  .NavBar-demoBtnIcon {
    margin-left: ${rem("2px")};
    font-size: ${rem("25px")};
  }

  .NavBar-getProBtn {
    .NavDropDown-navBtn {
      background: ${theme.property.main};
    }
  }

  .NavBar-getProBtnIcon {
    margin-left: ${rem("4px")};
    font-size: ${rem("23px")};
  }

  .NavBar-leftSide {
    display: flex;
    align-items: center;
    height: 100%;
  }
  .NavBar-brandBtn {
    height: 100%;
    font-size: 1.4rem;
    font-weight: 700;
    color: ${theme.dark};
    :hover {
      color: ${theme.light};
    }
  }

  .NavBar-rightSide {
    display: flex;
  }
  .NavBar-getProBtn {
    height: 100%;
  }
`;
