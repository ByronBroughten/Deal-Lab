import { Button } from "@material-ui/core";
import { rem } from "polished";
import { AiOutlineMenu } from "react-icons/ai";
import styled, { css } from "styled-components";
import { constants } from "../../Constants";
import { useUserData } from "../../modules/customHooks/useAuthAndUserData";
import { useFeUser } from "../../modules/sectionActorHooks/useFeUser";
import { AnalyzerPlan } from "../../sharedWithServer/SectionsMeta/baseSectionsVarbs";
import theme from "../../theme/Theme";
import { DomLink } from "../ActiveDeal/general/DomLink";
import { StandardProps } from "../general/StandardProps";
import NavDropDown from "./NavDropDown";

function BtnDiv({ children, className }: StandardProps) {
  return <div className={`NavUserMenu-btnDiv ${className}`}>{children}</div>;
}

export function NavUserMenu() {
  const feUser = useFeUser();
  const { logout } = useUserData();
  const analyzerPlan = feUser.get.valueNext("analyzerPlan") as AnalyzerPlan;
  const isFullPlan = analyzerPlan === "fullPlan";
  const authStatus = feUser.get.valueNext("authStatus");
  const userName = feUser.get.value("userName", "string");
  return (
    <Styled
      {...{ $isFullPlan: isFullPlan }}
      btnIcon={<AiOutlineMenu className="NavBar-menuIcon" />}
      dropDirection={"right"}
    >
      <div className="NavUserMenu-dropdown">
        <BtnDiv>
          <DomLink to={constants.feRoutes.userLists}>
            <Button>{`Your lists`}</Button>
          </DomLink>
        </BtnDiv>
        <BtnDiv>
          <DomLink to={constants.feRoutes.userVariables}>
            <Button>{`Your variables`}</Button>
          </DomLink>
        </BtnDiv>
        {/* <BtnDiv>
          <Button href={constants.feRoutes.userLists}>{`Your lists`}</Button>
        </BtnDiv>
        <BtnDiv>
          <Button
            href={constants.feRoutes.userOutputs}
          >{`Your outputs`}</Button>
        </BtnDiv> */}
        {authStatus !== "guest" && (
          <BtnDiv>
            <Button onClick={logout}>Logout</Button>
          </BtnDiv>
        )}

        {/* <BtnDiv>
                <Button href="/account" disabled>
                  Account Info
                </Button>
              </BtnDiv> */}
      </div>
    </Styled>
  );
}

const Styled = styled(NavDropDown)<{ $isFullPlan: boolean }>`
  display: flex;
  flex-direction: column;

  text-wrap: nowrap;

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
