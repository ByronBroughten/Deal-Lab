import { AppBar, Toolbar } from "@material-ui/core";
import { rem } from "polished";
import React from "react";
import { AiOutlineYoutube } from "react-icons/ai";
import { BsArrowUpCircle, BsFillHouseDoorFill } from "react-icons/bs";
import { VscFeedback } from "react-icons/vsc";
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

type NavBarProps = { logout: () => void };
export default function NavBar(props: NavBarProps) {
  const feUser = useFeUser();
  const { isBasic, isGuest } = feUser;
  const userInfo = feUser.get.onlyChild("userInfo");

  const { pathname } = useLocation();
  const showSignin = isGuest; // && !pathname.includes("/auth");

  const appTitle =
    "Ultimate Property Analyzer" + (constants.isBeta ? " BETA" : "");

  return (
    <Styled className="NavBar-root">
      <Toolbar disableGutters={true}>
        <div className="NavBar-leftSide">
          {!isGuest && <NavUserMenu {...{ ...props, feId: userInfo.feId }} />}
          <Link className="NavBar-navBtnLink" to="/">
            <NavBtn
              className="NavBar-brandBtn"
              icon={<BsFillHouseDoorFill className="NavBar-brandIcon" />}
              text={<span className="NavBar-brandName">{appTitle}</span>}
            />
          </Link>
        </div>
        <div className="NavBar-rightSide">
          <NavBtn
            className="NavBar-demoBtn NavBtn"
            href="https://www.youtube.com/watch?v=wGfb8xX2FsI"
            target="_blank"
            icon={<AiOutlineYoutube className="NavBar-demoBtnIcon" />}
            text="Demo"
          />
          {constants.isBeta && (
            <NavDropDown
              className="NavBar-feedbackDropDown"
              btnText="Give Feedback"
              btnIcon={<VscFeedback />}
            >
              <FeedbackPanel />
            </NavDropDown>
          )}
          {showSignin && (
            <>
              <Link className="NavBar-navBtnLink" to="/auth">
                <NavBtn text="Sign In / Sign Up" />
              </Link>
            </>
          )}
          {!isGuest && isBasic && !constants.isBeta && false && (
            <NavDropDown
              className="NavBar-GetProDropdown"
              btnText={
                <>
                  <BsArrowUpCircle className="NavBar-GetProDropdownIcon" />
                  <span className="NavBar-GetProDropdownText">Pro</span>
                </>
              }
            >
              <UpgradeUserToProPanel />
            </NavDropDown>
          )}
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

  .NavBar-GetProDropdown {
    .NavDropDown-navBtn {
      background: ${theme.property.main};
    }
  }
  .NavBar-GetProDropdownIcon {
    margin-left: ${rem("4px")};
    font-size: ${rem("23px")};
  }

  .NavBar-leftSide,
  .NavBar-rightSide {
    display: flex;
  }
`;
