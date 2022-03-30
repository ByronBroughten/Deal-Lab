import React from "react";
import styled from "styled-components";
import { AppBar, Toolbar } from "@material-ui/core";
import theme from "../theme/Theme";
import { LoginForm } from "./NavBar/LoginForm";
import NavDropDown from "./NavBar/NavDropDown";
import { RegisterForm } from "./NavBar/RegisterForm";
import NavBtn from "./NavBar/NavBtn";
import NavUserMenu from "./NavBar/NavUserMenu";
import { auth } from "../modules/services/authService";
import { Link } from "react-router-dom";
import { StyledDropdownForm } from "./general/DropdownForm";
import { rem } from "polished";
import { AiOutlineYoutube } from "react-icons/ai";
import { BsArrowUpCircle, BsFillHouseDoorFill } from "react-icons/bs";

export default function NavBar({ className }: { className?: string }) {
  return (
    <Styled className={`NavBar-root ${className ?? ""}`}>
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
          {!auth.isLoggedIn && (
            <>
              <NavDropDown btnText="Create Account">
                <RegisterForm />
              </NavDropDown>
              <NavDropDown btnText="Login">
                <LoginForm />
              </NavDropDown>
            </>
          )}
          {auth.isLoggedIn && (
            <NavDropDown
              className="NavBar-getProBtn"
              btnText={
                <>
                  <span className="NavBar-getProBtnText">Pro</span>
                  <BsArrowUpCircle className="NavBar-getProBtnIcon" />
                </>
              }
            >
              <StyledDropdownForm className="DropdownForm-comingSoon">
                Coming Soon!
              </StyledDropdownForm>
            </NavDropDown>
          )}
          <NavUserMenu />
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
  background-color: ${theme.analysis.main};
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
