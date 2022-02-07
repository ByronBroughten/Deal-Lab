import { Button } from "@material-ui/core";
import styled from "styled-components";
import { StandardProps } from "../general/StandardProps";
import { AiOutlineMenu } from "react-icons/ai";
import NavBtn from "./NavBtn";
import useToggleView from "../../modules/customHooks/useToggleView";
import useOnOutsideClickRef from "../../modules/customHooks/useOnOutsideClickRef";
import theme from "../../theme/Theme";
import { rem } from "polished";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import { auth } from "../../modules/services/authService";

function BtnDiv({ children, className }: StandardProps) {
  return <div className={`NavUserMenu-btnDiv ${className}`}>{children}</div>;
}

export default function NavUserMenu() {
  const { logout, analyzer } = useAnalyzerContext();
  const { viewIsOpen, toggleView, closeView } = useToggleView({
    initValue: false,
  });
  const closeIfClickOutsideRef = useOnOutsideClickRef(closeView);
  const userName = analyzer.singleSection("user").value("userName", "string");

  const preceding = auth.isLoggedIn ? "Your " : "Guest ";

  return (
    <Styled ref={closeIfClickOutsideRef}>
      {auth.isLoggedIn && (
        // this is guarded by auth just temporarily
        <NavBtn
          className="NavUserMenu-navBtn"
          onClick={toggleView}
          $isactive={viewIsOpen}
        >
          <span>
            <span>{userName}</span>
            <AiOutlineMenu className="NavBar-menuIcon" />
          </span>
        </NavBtn>
      )}
      {viewIsOpen && (
        <div className="NavUserMenu-dropdown">
          {/* <BtnDiv>
            <Button href="/variables">{`${preceding} Variables`}</Button>
          </BtnDiv>
          <BtnDiv>
            <Button href="/lists">{`${preceding} Lists`}</Button>
          </BtnDiv> */}
          {auth.isLoggedIn && (
            <>
              <BtnDiv>
                <Button onClick={logout}>Logout</Button>
              </BtnDiv>
              {/* <BtnDiv>
                <Button href="/account" disabled>
                  Account Info
                </Button>
              </BtnDiv> */}
            </>
          )}
        </div>
      )}
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  flex-direction: column;

  .NavBar-menuIcon {
    margin-left: ${theme.s4};
    height: 24px;
    width: 24px;
  }

  .NavUserMenu-navBtn {
    min-height: ${theme.navBar.height};
    min-width: ${rem(112.78)};
    position: relative;
    z-index: 1;
  }

  .NavUserMenu-dropdown {
    position: relative;
    z-index: 0;
    width: 100%;
    background-color: ${theme.navBar.activeBtn};
    border-radius: 0 0 0 ${theme.br1};
    box-shadow: ${theme.boxShadow4};
  }
  .NavUserMenu-btnDiv {
    width: 100%;
    .MuiButtonBase-root {
      width: 100%;
      border-radius: 0;

      display: flex;
      justify-content: flex-start;
      padding: ${theme.s3};
      font-size: 1em;
      :hover,
      :focus {
        background-color: ${theme.error.light};
        color: ${theme.loan.dark};
      }

      .MuiTouchRipple-root {
        visibility: hidden;
      }
    }
  }
`;
