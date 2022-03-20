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

export default function NavBar({ className }: { className?: string }) {
  return (
    <Styled className={`NavBar-root ${className ?? ""}`}>
      <Toolbar disableGutters={true}>
        <div className="NavBar-leftSide">
          <Link className="NavBar-analyzerLink" to="/analyzer">
            <NavBtn className="NavBar-brandName">Ultimate Deal Analyzer</NavBtn>
          </Link>
          <NavBtn
            className="NavBar-demoBtn NavBtn"
            href="https://www.youtube.com/watch?v=sqlMZxsMOlU"
            target="_blank"
          >
            Demo
          </NavBtn>
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
              className="NavBar-upgradeToProBtn"
              btnText="Upgrade to Pro"
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

  .NavBtn {
    font-size: 1.1rem;
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

  .NavBar-leftSide {
    display: flex;
    align-items: center;
    height: 100%;
  }
  .NavBar-brandName {
    height: 100%;
    font-size: 1.2rem;
    font-weight: 700;
    color: ${theme["gray-800"]};
    :hover {
      color: ${theme.light};
    }
  }

  .NavBar-rightSide {
    display: flex;
  }
  .NavBar-upgradeToProBtn {
    height: 100%;
  }
`;
