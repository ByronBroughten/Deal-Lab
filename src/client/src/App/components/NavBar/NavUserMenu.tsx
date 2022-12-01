import { rem } from "polished";
import React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { FaThList } from "react-icons/fa";
import { GrLogout } from "react-icons/gr";
import { HiOutlineVariable } from "react-icons/hi";
import { MdAccountCircle } from "react-icons/md";
import styled, { css } from "styled-components";
import { constants } from "../../Constants";
import { useUserData } from "../../modules/customHooks/useAuthAndUserData";
import useToggle from "../../modules/customHooks/useToggle";
import { useFeUser } from "../../modules/sectionActorHooks/useFeUser";
import { goToCustomerPortalPage } from "../../modules/services/stripeService";
import { AnalyzerPlan } from "../../sharedWithServer/SectionsMeta/baseSectionsVarbs";
import theme from "../../theme/Theme";
import { DomLink } from "../ActiveDeal/general/DomLink";
import { ListMenuBtn } from "../appWide/ListGroup/ListGroupShared/ListMenuSimple/ListMenuBtn";
import { StandardProps } from "../general/StandardProps";
import { NavDropDown } from "./NavDropDown";

function BtnDiv({ children, className }: StandardProps) {
  return <div className={`NavUserMenu-btnDiv ${className}`}>{children}</div>;
}

export function NavUserMenu() {
  const feUser = useFeUser();
  const { logout } = useUserData();
  const analyzerPlan = feUser.get.valueNext("analyzerPlan") as AnalyzerPlan;
  const isFullPlan = analyzerPlan === "fullPlan";
  const { authStatus } = feUser;
  const titles = {
    guest: {
      lists: "Lists",
      variables: "Variables",
    },
    user: {
      lists: "Your lists",
      variables: "Your variables",
    },
  };
  const { value: doCloseMenuToggle, toggle: closeMenu } = useToggle();
  return (
    <Styled
      {...{ $isFullPlan: isFullPlan }}
      btnIcon={<AiOutlineMenu className="NavBar-menuIcon" />}
      dropDirection={"right"}
      doCloseViewToggle={doCloseMenuToggle}
    >
      <div className="NavUserMenu-dropdown">
        <BtnDiv>
          <DomLink to={constants.feRoutes.userLists}>
            <ListMenuBtn
              text={titles[authStatus].lists}
              onClick={closeMenu}
              icon={<FaThList />}
            />
          </DomLink>
        </BtnDiv>
        <BtnDiv>
          <DomLink to={constants.feRoutes.userVariables}>
            <ListMenuBtn
              text={titles[authStatus].variables}
              onClick={closeMenu}
              icon={<HiOutlineVariable className="NavUserMenu-variablesIcon" />}
            />
          </DomLink>
        </BtnDiv>
        {feUser.isPro && (
          <BtnDiv>
            <ListMenuBtn
              text="Account"
              icon={<MdAccountCircle />}
              onClick={goToCustomerPortalPage}
            />
          </BtnDiv>
        )}
        {authStatus !== "guest" && (
          <BtnDiv>
            <ListMenuBtn text="Logout" icon={<GrLogout />} onClick={logout} />
          </BtnDiv>
        )}
      </div>
    </Styled>
  );
}

const Styled = styled(NavDropDown)<{ $isFullPlan: boolean }>`
  display: flex;
  flex-direction: column;

  text-wrap: nowrap;

  .ListMenuBtn-text {
    margin-left: ${theme.s3};
  }

  .NavBar-menuIcon {
    margin-left: ${constants.isBeta ? "0px" : theme.s3};
    height: 24px;
    width: 24px;
  }

  .NavUserMenu-nameDiv {
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  .NavUserMenu-navBtn {
    ${({ $isFullPlan }) =>
      $isFullPlan &&
      !constants.isBeta &&
      false &&
      css`
        background-color: ${theme.property.main};
      `}

    min-height: ${theme.navBar.height};
    min-width: ${rem(50)};
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
  .MuiButton-label {
    white-space: nowrap;
  }
  .NavUserMenu-btnDiv {
    width: 100%;
    .MuiButtonBase-root {
      width: 100%;
      border-radius: 0;

      display: flex;
      justify-content: flex-start;
      padding: ${theme.s3};
      font-size: 1rem;
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
