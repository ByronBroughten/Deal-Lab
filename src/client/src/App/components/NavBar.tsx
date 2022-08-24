import { AppBar, Toolbar } from "@material-ui/core";
import { rem } from "polished";
import React from "react";
import { BsArrowUpCircle, BsFillHouseDoorFill } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { constants } from "../Constants";
import { useFeUser } from "../modules/sectionActorHooks/useFeUser";
import theme from "../theme/Theme";
import { FeedbackPanel } from "./NavBar/FeedbackPanel";
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

  const appTitle =
    "Ultimate Property Analyzer" + (constants.isBeta ? " BETA" : "");

  return (
    <Styled className="NavBar-root">
      <Toolbar disableGutters={true}>
        <div className="NavBar-leftSide">
          <Link className="NavBar-navBtnLink" to="/">
            <NavBtn className="NavBar-brandBtn">
              <BsFillHouseDoorFill className="NavBar-brandIcon" />
              <span className="NavBar-brandName">{appTitle}</span>
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
            </>
          )}
          {constants.isBeta && (
            <NavDropDown
              className="NavBar-feedbackDropDown"
              btnText="Give Feedback"
            >
              <FeedbackPanel />
            </NavDropDown>
          )}
          {!isGuest && isBasic && !constants.isBeta && false && (
            <NavDropDown
              className="NavBar-GetProDropdown"
              btnText={
                <>
                  <span className="NavBar-GetProDropdownText">Pro</span>
                  <BsArrowUpCircle className="NavBar-GetProDropdownIcon" />
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
    font-size: ${constants.isBeta ? "16px" : "20px"};
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

  .NavBar-GetProDropdown {
    .NavDropDown-navBtn {
      background: ${theme.property.main};
    }
  }

  .NavBar-feedbackDropDown {
    .NavDropDown-navBtn {
      font-size: 14px;
    }
  }

  .NavBar-GetProDropdownIcon {
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
    font-size: 1.3rem;
    font-weight: 700;
    color: ${theme.dark};
    :hover {
      color: ${theme.light};
    }
  }
  .NavBar-rightSide {
    display: flex;
  }
`;
