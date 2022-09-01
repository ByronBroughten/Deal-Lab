import React from "react";
import styled, { css } from "styled-components";
import { useAuthStatus } from "../sharedWithServer/stateClassHooks/useAuthStatus";
import theme, { ThemeName } from "../theme/Theme";
import { PageMain } from "./general/PageMain";

type Props = {
  themeName: ThemeName;
  saveWhat: string;
  children: React.ReactNode;
};
export function UserListsGeneral({ themeName, children, saveWhat }: Props) {
  const authStatus = useAuthStatus();
  return (
    <Styled $themeName={themeName}>
      {authStatus === "guest" && (
        <div className="UserListsGeneral-notLoggedIn">
          <div className="UserListsGeneral-notLoggedInInner">
            {`To create and save ${saveWhat}, sign in or make an account.`}
          </div>
        </div>
      )}
      {authStatus !== "guest" && children}
    </Styled>
  );
}

const Styled = styled(PageMain)<{ $themeName: ThemeName }>`
  ${({ $themeName }) => css`
    background: ${theme[$themeName].light};
  `}

  .UserListsGeneral-notLoggedIn {
    display: flex;
    justify-content: center;
    .UserListsGeneral-notLoggedInInner {
      margin: ${theme.s3};
    }
  }
  .UserListsGeneral-notLoggedInInner {
    color: ${theme.dark};
    padding: ${theme.s3};
    border-radius: ${theme.br1};
    font-size: 18px;
    font-weight: 700;
  }
`;
