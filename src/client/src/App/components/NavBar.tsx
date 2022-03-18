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

export default function NavBar() {
  return (
    <Styled>
      <Toolbar disableGutters={true}>
        <div className="NavBar-leftSide">
          <Link className="Analyzer-link" to="/analyzer">
            <NavBtn className="NavBar-brandName">Ultimate Deal Analyzer</NavBtn>
          </Link>
          <NavBtn
            className="NavBar-brandName"
            href="https://www.youtube.com/watch?v=sqlMZxsMOlU"
            target="_blank"
          >
            Demo
          </NavBtn>
        </div>
        <div className="NavBar-btns Logged Out">
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
          <NavUserMenu />
        </div>
      </Toolbar>
    </Styled>
  );
}

const Styled = styled(AppBar)`
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

  .Analyzer-link {
    display: flex;
    text-decoration: none;
  }

  .NavBar-leftSide {
    display: flex;
  }
  .NavBar-brandName {
    font-size: 1.1em;
  }

  .NavBar-rightSide {
    display: flex;
  }

  .NavBar-btns {
    display: flex;
  }
`;
