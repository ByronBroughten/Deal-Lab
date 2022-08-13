import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import { constants } from "../../Constants";
import { useSetterSection } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { useFeUser } from "../sectionActorHooks/useFeUser";
import { auth } from "../services/authService";

function useGetAuthStateIfSessionExists() {
  const feUser = useFeUser();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    async function syncStateWithSessionLogin() {
      if ((await feUser.sessionExists) && feUser.authStatus === "guest") {
        feUser.loadUserData();
      } else if (pathname.includes(constants.auth.successUrlEnd)) {
        navigate("/");
      }
    }
    syncStateWithSessionLogin();
  });
}

function useLogoutIfNoSessionExists() {
  const feUser = useFeUser();
  const stateToDefault = useStateToDefault();

  React.useEffect(() => {
    async function syncStateWithSessionLogout() {
      if (!(await feUser.sessionExists) && feUser.authStatus !== "guest") {
        stateToDefault();
      }
    }
    syncStateWithSessionLogout();
  });
}

function useStateToDefault() {
  const main = useSetterSection();
  return () => {
    auth.removeToken();
    main.resetToDefault();
  };
}
// Ok. Now I'm basically going to do this
// for when a pro subscription expires.
// Will "getUserData" work?

export function useAuthAndLogin() {
  useGetAuthStateIfSessionExists();
  useLogoutIfNoSessionExists();

  const stateToDefault = useStateToDefault();
  async function logout() {
    await signOut();
    stateToDefault();
  }
  return { logout };
}
