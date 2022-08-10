import { AppBar, Toolbar } from "@material-ui/core";
import { rem } from "polished";
import React from "react";
import { BsArrowUpCircle, BsFillHouseDoorFill } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useFeUser } from "../modules/sectionActorHooks/useFeUser";
import theme from "../theme/Theme";
import NavBtn from "./NavBar/NavBtn";
import NavDropDown from "./NavBar/NavDropDown";
import { NavUserMenu } from "./NavBar/NavUserMenu";
import { UpgradeUserToProPanel } from "./NavBar/UpgradeUserToProPanel";

// For testing purposes, do I need to add a route for deleting a user?
// I don't have infinite email addresses, after all.

type NavBarProps = { logout: () => void };
export default function NavBar(props: NavBarProps) {
  const feUser = useFeUser();
  const { isBasic, isGuest } = feUser;
  const userInfo = feUser.get.onlyChild("userInfo");

  const { pathname } = useLocation();
  const showSignin = isGuest && !pathname.includes("/auth");

  return (
    <Styled className="NavBar-root">
      <Toolbar disableGutters={true}>
        <div className="NavBar-leftSide">
          <Link className="NavBar-navBtnLink" to="/">
            <NavBtn className="NavBar-brandBtn">
              <BsFillHouseDoorFill className="NavBar-brandIcon" />
              <span className="NavBar-brandName">
                Ultimate Property Analyzer
              </span>
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
          {showSignin && (
            <>
              <Link className="NavBar-navBtnLink" to="/auth">
                <NavBtn>
                  <span>Sign In / Sign Up</span>
                </NavBtn>
              </Link>
              {/* <NavDropDown btnText="Create Account">
                <RegisterForm />
              </NavDropDown>
              <NavDropDown btnText="Login">
                <LoginForm />
              </NavDropDown> */}
              {/* {constants.environment !== "production" && (
                <NavBtn onClick={props.logout}>
                  <span>Logout</span>
                </NavBtn>
              )} */}
            </>
          )}
          {!isGuest && isBasic && (
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
          <NavUserMenu {...{ ...props, feId: userInfo.feId }} />
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
    font-size: 20px;
  }

  .NavBar-navBtnLink {
  }

  .NavBar-navBtnLink {
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
