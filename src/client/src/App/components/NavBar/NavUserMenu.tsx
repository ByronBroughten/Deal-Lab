import { Button } from "@material-ui/core";
import { rem } from "polished";
import { AiOutlineMenu } from "react-icons/ai";
import styled from "styled-components";
import useOnOutsideClickRef from "../../modules/customHooks/useOnOutsideClickRef";
import useToggleView from "../../modules/customHooks/useToggleView";
import { auth } from "../../modules/services/authService";
import { useGetterSection } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../theme/Theme";
import { StandardProps } from "../general/StandardProps";
import NavBtn from "./NavBtn";

function BtnDiv({ children, className }: StandardProps) {
  return <div className={`NavUserMenu-btnDiv ${className}`}>{children}</div>;
}

export type NavUserMenuProps = {
  feId: string;
  logout: () => void;
};
export function NavUserMenu({ feId, logout }: NavUserMenuProps) {
  const user = useGetterSection({
    sectionName: "user",
    feId,
  });

  const { viewIsOpen, toggleView, openView, closeView } = useToggleView({
    initValue: false,
  });
  const closeIfClickOutsideRef = useOnOutsideClickRef(closeView);
  const userName = user.value("userName", "string");
  return (
    <Styled ref={closeIfClickOutsideRef}>
      {auth.isLoggedIn && (
        // this is guarded by auth just temporarily
        <NavBtn
          className="NavUserMenu-navBtn"
          onClick={toggleView}
          $isactive={viewIsOpen}
        >
          <div className="NavUserMenu-nameDiv">
            <span>{userName}</span>
            <AiOutlineMenu className="NavBar-menuIcon" />
          </div>
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

  .NavUserMenu-nameDiv {
    display: flex;
    align-items: center;
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
        color: ${theme.next.dark};
      }

      .MuiTouchRipple-root {
        visibility: hidden;
      }
    }
  }
`;
