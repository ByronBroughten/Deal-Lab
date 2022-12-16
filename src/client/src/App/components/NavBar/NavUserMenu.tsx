import { rem } from "polished";
import React from "react";
import { BiLogOut, BiUserCircle } from "react-icons/bi";
import { MdAccountCircle } from "react-icons/md";
import styled from "styled-components";
import { useUserData } from "../../modules/customHooks/useAuthAndUserData";
import useToggle from "../../modules/customHooks/useToggle";
import { useFeUser } from "../../modules/sectionActorHooks/useFeUser";
import { goToCustomerPortalPage } from "../../modules/services/stripeService";
import { AnalyzerPlan } from "../../sharedWithServer/SectionsMeta/baseSectionsVarbs";
import theme from "../../theme/Theme";
import { NavDropdownMenuBtn } from "../appWide/ListGroup/ListGroupShared/ListMenuSimple/NavDropdownMenuBtn";
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
  const { value: doCloseMenuToggle, toggle: closeMenu } = useToggle();
  return (
    <Styled
      {...{ $isFullPlan: isFullPlan }}
      btnIcon={<BiUserCircle size={28} />}
      dropDirection={"left"}
      doCloseViewToggle={doCloseMenuToggle}
    >
      <div className="NavUserMenu-dropdown">
        {feUser.isPro && (
          <BtnDiv>
            <NavDropdownMenuBtn
              text="Account"
              icon={<MdAccountCircle size={22} />}
              onClick={goToCustomerPortalPage}
            />
          </BtnDiv>
        )}
        <BtnDiv>
          <NavDropdownMenuBtn
            text="Logout"
            icon={<BiLogOut size={20} />}
            onClick={logout}
          />
        </BtnDiv>
      </div>
    </Styled>
  );
}

const Styled = styled(NavDropDown)<{ $isFullPlan: boolean }>`
  display: flex;
  flex-direction: column;
  text-wrap: nowrap;
  margin-right: ${theme.s4};

  .NavUserMenu-btnDiv {
    :first-child {
      .NavDropdownMenuBtn-root {
        border-bottom: none;
      }
    }
    :last-child {
      .NavDropdownMenuBtn-root {
        border-radius: 0 0 ${theme.br0} ${theme.br0};
      }
    }
  }

  .ListMenuBtn-text {
    margin-left: ${theme.s3};
  }

  .NavUserMenu-nameDiv {
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  .NavUserMenu-navBtn {
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
  }

  .NavUserMenu-btnDiv {
    width: 100%;
  }
`;
